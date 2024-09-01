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
use tauri::api::path::data_dir;
use uuid::Uuid;

use crate::{config::create_config_file, conversion::transition_json_to_db};

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub content: String,
    pub author: String,
    pub timestamp: i64,
}

pub fn get_internal_data() -> Vec<Message> {
    let p = data_dir()
        .expect("data_dir() failed.")
        .join("YouAreTyping/");
    let mut generate_table = false;
    let old_json_file = p.join("messages.json");

    if !p.exists() || !p.join("YouAreTyping.db").exists() {
        // create the path
        fs::create_dir_all(&p).expect("Creating YouAreTyping directory failed.");
        generate_table = true;
    }

    if !data_dir()
        .expect("data_dir() failed to initiate.")
        .join("YouAreTyping/config.json")
        .exists()
    {
        create_config_file();
    }

    let conn =
        Connection::open(p.join("YouAreTyping.db")).expect("YouAreTyping.db failed to open.");

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
        transition_json_to_db(&p);
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

pub fn save_internal_data(message: Message) {
    let db_path = data_dir()
        .expect("data_dir() failed inside of save_internal_data.")
        .join("YouAreTyping/YouAreTyping.db");
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
