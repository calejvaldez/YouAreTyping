/*
conversion.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Has to do with converting the conversation from the database to JSON/CSV.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use crate::messages::Message;
use chrono::{DateTime, Local};
use rusqlite::{named_params, Connection};
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::{api::dialog, AppHandle};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct JsonMessage {
    content: String,
    author: String,
    timestamp: i64,
}

pub fn transition_json_to_db(data_dir: &PathBuf) {
    let json_path = data_dir.join("messages.json");
    let conn = Connection::open(data_dir.join("YouAreTyping.db"))
        .expect("Establishing connection in transition_json_to_db failed.");

    let data = fs::read_to_string(&json_path)
        .expect("Failed to read the INTERNAL_DATA_PATH file correctly.");
    let messages: Vec<JsonMessage> =
        serde_json::from_str(&data).expect("Converting str to JSON failed.");

    for msg in messages {
        conn.execute(
            "INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)",
            (
                Uuid::new_v4().to_string(),
                msg.author,
                msg.content,
                msg.timestamp,
            ),
        )
        .expect("Inserting a message failed.");
    }

    fs::remove_file(json_path).expect("Deleting old JSON failed.");
}

pub fn export_to_json(app: &AppHandle) {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let db_path = app_data_dir.join("YouAreTyping.db");
    let conn = Connection::open(db_path).expect("Connection for exporting failed to open.");

    let mut messages: Vec<Message> = vec![];

    let mut stmt = conn
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
        messages.push(msg.unwrap());
    }

    let as_str = serde_json::to_string(&messages).expect("Converting from vec to string failed.");

    dialog::FileDialogBuilder::new().pick_folder(|folder| {
        fs::write(
            folder.expect("Folder failed to set.").join("messages.json"),
            as_str,
        )
        .expect("Saving file to folder failed.");
    })
}

pub fn export_to_csv(app: &AppHandle) {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let mut csv_string = String::from("id,timestamp,author,content\n");
    let db_path = app_data_dir.join("YouAreTyping.db");
    let conn = Connection::open(db_path).expect("Connection for exporting failed to open.");

    let mut stmt = conn
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
        let unwrapped = msg.unwrap();
        let ts = DateTime::from_timestamp(unwrapped.timestamp, 0)
            .unwrap()
            .with_timezone(&Local::now().timezone());

        let (id, author, content, timestamp) = (
            unwrapped.id,
            unwrapped.author,
            format!(
                "\"{}\"",
                unwrapped
                    .content
                    .replace("\n", r#"\n"#)
                    .replace("\"", "\"\"")
            ),
            ts.format("%Y-%m-%d %I:%M %p %z").to_string(),
        );

        csv_string.push_str(format!("{id},{timestamp},{author},{content}\n").as_str());
    }

    dialog::FileDialogBuilder::new().pick_folder(|folder| {
        fs::write(
            folder.expect("Folder failed to set.").join("messages.csv"),
            csv_string,
        )
        .expect("Saving file to folder failed.");
    })
}

fn message_in_db(app_data_dir: &PathBuf, id: &String) -> bool {
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();

    let mut stmt = conn
        .prepare("SELECT * FROM message WHERE id = :id")
        .unwrap();

    for msg in stmt
        .query_map(named_params! {":id": id}, |row| {
            Ok(Message {
                id: row.get(0)?,
                author: row.get(1)?,
                content: row.get(2)?,
                timestamp: row.get(3)?,
            })
        })
        .unwrap()
    {
        if &msg.unwrap().id == id {
            return true;
        }
    }

    return false;
}

pub fn import_as_json(app: &AppHandle) {
    let app_cloned = app.clone();
    dialog::FileDialogBuilder::new().pick_file(move |file| {
        let app_data_dir = app_cloned.path_resolver().app_data_dir().unwrap();

        let contents = fs::read_to_string(file.unwrap()).unwrap();
        let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();

        let messages: Vec<Message> =
            serde_json::from_str(&contents).expect("Converting str to JSON failed.");

        for message in messages {
            if !message_in_db(&app_data_dir, &message.id) {
                conn.execute(
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

        app_cloned.restart();
    });
}
