// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};
use serde::{Deserialize, Serialize};
use tauri::api::path::data_dir;
use rusqlite::Connection;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct Message {
  id: String,
  content: String,
  author: String,
  timestamp: i64
}

#[derive(Serialize, Deserialize)]
struct JsonMessage {
  content: String,
  author: String,
  timestamp: i64
}

fn transition_json_to_db(data_dir: &PathBuf) {
  let json_path = data_dir.join("messages.json");
  let conn = Connection::open(data_dir.join("YouAreTyping.db")).expect("Establishing connection in transition_json_to_db failed.");

  let data = fs::read_to_string(&json_path).expect("Failed to read the INTERNAL_DATA_PATH file correctly.");
  let messages: Vec<JsonMessage> = serde_json::from_str(&data).expect("Converting str to JSON failed.");

  for msg in messages {
    conn.execute("INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)", (Uuid::new_v4().to_string(), msg.author, msg.content, msg.timestamp)).expect("Inserting a message failed.");
  }

  fs::remove_file(json_path).expect("Deleting old JSON failed.");
}

fn get_internal_data() -> Vec<Message> {
  let p = data_dir().expect("data_dir() failed.").join("YouAreTyping/");
  let mut generate_table = false;
  let old_json_file = p.join("messages.json");

  if !p.exists() || !p.join("YouAreTyping.db").exists() {
    // create the path
    fs::create_dir_all(&p).expect("Creating YouAreTyping directory failed.");
    generate_table = true;
  }

  let conn = Connection::open(p.join("YouAreTyping.db")).expect("YouAreTyping.db failed to open.");

  if generate_table {
    conn.execute("CREATE TABLE message (
    id TEXT PRIMARY KEY NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    time_stamp INTEGER NOT NULL
    )", ()).expect("Creating message table failed.");
  }

  if old_json_file.exists() {
    transition_json_to_db(&p);
  }

  let mut messages: Vec<Message> = vec![];

  let mut stmt = conn.prepare("SELECT * FROM message ORDER BY time_stamp DESC").expect("SELECT * FROM message statement failed.");
  for msg in stmt.query_map([], |row|{
    Ok(
      Message {
        id: row.get(0)?,
        author: row.get(1)?,
        content: row.get(2)?,
        timestamp: row.get(3)?
      }
    )
  }).expect("Transferring db to Message struct failed.") {
    messages.push(msg.unwrap());
  }

  return messages;
}

fn save_internal_data(message: Message) {
  let db_path = data_dir().expect("data_dir() failed inside of save_internal_data.").join("YouAreTyping/YouAreTyping.db");
  let conn = Connection::open(db_path).expect("Connection in save_internal_data failed.");
  
  conn.execute("INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)", (Uuid::new_v4().to_string(), message.author, message.content, message.timestamp)).expect("Inserting a message failed.");
}

#[tauri::command(rename_all = "snake_case")]
fn save_message(content: String, author: String, timestamp: i64) {
  save_internal_data(Message {id: Uuid::new_v4().to_string(), content: content.to_string(), author: author.to_string(), timestamp});
}

#[tauri::command(rename_all = "snake_case")]
fn get_messages() -> Vec<Message> {
  get_internal_data()
}

fn main() {
  let _ = fix_path_env::fix();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_message, get_messages])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
