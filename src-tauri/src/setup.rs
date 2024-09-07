use crate::{config::create_config_file, conversion::transition_json_to_db, structs::Message};
use rusqlite::Connection;
use std::{error::Error, fs, path::PathBuf};
use tauri::{App, AppHandle, Manager};

fn create_database(app_data_dir: &PathBuf) {
    let path = app_data_dir.join("YouAreTyping.db");
    let conn = Connection::open(path).unwrap();

    conn.execute(
        "CREATE TABLE message (
        id TEXT PRIMARY KEY NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        time_stamp INTEGER NOT NULL
        )",
        (),
    )
    .expect("Creating message table failed.");
}

/// Files used to be stored in an old JSON file. This function exists to
/// transfer the old JSON file into the new database format.
fn transfer_old_json_file(app_data_dir: &PathBuf) {
    let old_json_file = app_data_dir
        .parent()
        .unwrap()
        .join("YouAreTyping/messages.json");

    if old_json_file.exists() {
        transition_json_to_db(
            &old_json_file.parent().unwrap().to_path_buf(),
            &app_data_dir,
        );
    }
}

fn transfer_db(app: &AppHandle, old_db_path: &PathBuf) {
    let old_conn = Connection::open(old_db_path).unwrap();
    let new_conn = Connection::open(
        app.path_resolver()
            .app_data_dir()
            .unwrap()
            .join("YouAreTyping.db"),
    )
    .unwrap();

    let mut stmt = old_conn
        .prepare("SELECT * FROM message ORDER BY time_stamp ASC")
        .expect("SELECT * FROM message failed.");

    for msg in stmt
        .query_map([], |row| {
            Ok(Message {
                id: row.get(0)?,
                author: row.get(1)?,
                content: row.get(2)?,
                timestamp: row.get(3)?,
            })
        })
        .expect("Transferring db to Message struct failed.")
    {
        let message = msg.unwrap();

        new_conn
            .execute(
                "INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)",
                (
                    message.id,
                    message.author,
                    message.content,
                    message.timestamp,
                ),
            )
            .unwrap();
    }
}

/// Files used to be stored inside of a folder called YouAreTyping. I didn't
/// know that folders should be stored in a folder named after the bundle ID,
/// in this case called `com.calejvaldez.YouAreTyping`. This transfers that to
/// the new folder.
fn transfer_old_yat_folder(app: &AppHandle, app_data_dir: &PathBuf) {
    let old_yat_folder = app_data_dir.parent().unwrap().join("YouAreTyping/");

    if old_yat_folder.exists() {
        for item in fs::read_dir(&old_yat_folder).unwrap() {
            let u_item = item.unwrap();

            if u_item.file_name() == "YouAreTyping.db" {
                let old_db_path = old_yat_folder.join("YouAreTyping.db");
                transfer_db(&app, &old_db_path);
                fs::remove_file(old_db_path).unwrap();
            } else {
                fs::rename(
                    old_yat_folder.join(u_item.file_name()),
                    app_data_dir.join(u_item.file_name()),
                )
                .unwrap();
            }
        }

        fs::remove_dir(old_yat_folder).unwrap();
        app.restart();
    }
}

pub fn handle_setup(app: &mut App) -> Result<(), Box<dyn Error>> {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();

    if !app_data_dir.exists() || !app_data_dir.join("YouAreTyping.db").exists() {
        fs::create_dir_all(&app_data_dir).unwrap();
        create_database(&app_data_dir);
    }

    if !app_data_dir.join("config.json").exists() {
        create_config_file(&app_data_dir);
    }

    transfer_old_json_file(&app_data_dir);
    transfer_old_yat_folder(&app.app_handle(), &app_data_dir);

    Ok(())
}
