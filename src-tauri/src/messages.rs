/*
messages.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Has to do with managing messages users send.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};
use uuid::Uuid;

use crate::{config::create_config_file, conversion::transition_json_to_db};

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub content: String,
    pub author: String,
    pub timestamp: i64,
}

pub fn delete_all_messages(app: AppHandle) {
    let p = app.path().app_data_dir().unwrap().join("YouAreTyping.db");

    let conn = Connection::open(p).unwrap();

    conn.execute("DELETE FROM message", []).unwrap();
    app.restart();
}

pub fn get_internal_data(app: AppHandle) -> Vec<Message> {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let mut generate_table = false;
    let old_json_file = app_data_dir
        .parent()
        .unwrap()
        .join("YouAreTyping/messages.json");

    if !app_data_dir.exists() || !app_data_dir.join("YouAreTyping.db").exists() {
        // create the path
        fs::create_dir_all(&app_data_dir).expect("Creating YouAreTyping directory failed.");
        generate_table = true;
    }

    if !app_data_dir.join("config.json").exists() {
        create_config_file(app_data_dir.clone());
    }

    let conn = Connection::open(app_data_dir.join("YouAreTyping.db"))
        .expect("YouAreTyping.db failed to open.");

    if generate_table {
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

    if old_json_file.exists() {
        transition_json_to_db(&app_data_dir);
    }

    let old_yat_folder = old_json_file.parent().unwrap();

    if old_yat_folder.exists() {
        for item in fs::read_dir(old_yat_folder).unwrap() {
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

    let mut messages: Vec<Message> = vec![];

    let mut stmt = conn
        .prepare("SELECT * FROM message ORDER BY time_stamp DESC")
        .expect("SELECT * FROM message statement failed.");
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

    return messages;
}

pub fn save_internal_data(app: AppHandle, message: Message) {
    let db_path = app.path().app_data_dir().unwrap().join("YouAreTyping.db");
    let conn = Connection::open(db_path).expect("Connection in save_internal_data failed.");

    conn.execute(
        "INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)",
        (
            Uuid::new_v4().to_string(),
            message.author,
            message.content,
            message.timestamp,
        ),
    )
    .expect("Inserting a message failed.");
}
