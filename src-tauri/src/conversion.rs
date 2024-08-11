use std::{fs, path::PathBuf};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use tauri::api::{dialog, path::data_dir};
use crate::messages::Message;

#[derive(Serialize, Deserialize)]
struct JsonMessage {
    content: String,
    author: String,
    timestamp: i64
}

pub fn transition_json_to_db(data_dir: &PathBuf) {
    let json_path = data_dir.join("messages.json");
    let conn = Connection::open(data_dir.join("YouAreTyping.db")).expect("Establishing connection in transition_json_to_db failed.");

    let data = fs::read_to_string(&json_path).expect("Failed to read the INTERNAL_DATA_PATH file correctly.");
    let messages: Vec<JsonMessage> = serde_json::from_str(&data).expect("Converting str to JSON failed.");

    for msg in messages {
        conn.execute("INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)", (Uuid::new_v4().to_string(), msg.author, msg.content, msg.timestamp)).expect("Inserting a message failed.");
    }

    fs::remove_file(json_path).expect("Deleting old JSON failed.");
}

pub fn export_to_json() {
    let db_path = data_dir().expect("data_dir() failed inside of save_internal_data.").join("YouAreTyping/YouAreTyping.db");
    let conn = Connection::open(db_path).expect("Connection for exporting failed to open.");

    let mut messages : Vec<Message> = vec![];

    let mut stmt = conn.prepare("SELECT * FROM message ORDER BY time_stamp ASC").expect("SELECT * FROM message failed.");

    for msg in stmt.query_map([], |row| {
        Ok(
        Message {
            id: row.get(0)?,
            author: row.get(1)?,
            content: row.get(2)?,
            timestamp: row.get(3)?
        }
    )
    }).expect("Transferring db to Message struct failed."){
        messages.push(msg.unwrap());
    };

    let as_str = serde_json::to_string(&messages).expect("Converting from vec to string failed.");

    dialog::FileDialogBuilder::new().pick_folder(|folder| {
        fs::write(folder.expect("Folder failed to set.").join("messages.json"), as_str).expect("Saving file to folder failed.");
    })
}
