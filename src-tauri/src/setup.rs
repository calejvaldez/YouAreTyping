use rusqlite::Connection;
use std::{env, error::Error, fs, path::PathBuf};
use tauri::{App, AppHandle, Manager};

use crate::{config::create_config_file, conversion::transition_json_to_db};

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

/// Files used to be stored inside of a folder called YouAreTyping. I didn't
/// know that folders should be stored in a folder named after the bundle ID,
/// in this case called `com.calejvaldez.YouAreTyping`. This transfers that to
/// the new folder.
fn transfer_old_yat_folder(app: &AppHandle, app_data_dir: &PathBuf) {
    let old_yat_folder = app_data_dir.parent().unwrap().join("YouAreTyping/");

    if old_yat_folder.exists() && env::consts::OS != "windows" {
        for item in fs::read_dir(&old_yat_folder).unwrap() {
            let u_item = item.unwrap();

            fs::rename(
                old_yat_folder.join(u_item.file_name()),
                app_data_dir.join(u_item.file_name()),
            )
            .unwrap();
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
