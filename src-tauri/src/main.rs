// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use serde::{Deserialize, Serialize};
use tauri::api::path::data_dir;

#[derive(Serialize, Deserialize)]
struct Message {
  content: String,
  author: String,
  timestamp: i64
}

fn get_internal_data() -> Vec<Message> {
  let p = data_dir().expect("data_dir() failed.").join("YouAreTyping/");
  let messages_path = p.join("messages.json");

  if !messages_path.exists() {
    fs::create_dir_all(p).expect("Creating YouAreTyping directory failed.");
    fs::write(&messages_path, r#"[]"#).expect("Writing default message.json failed.");
  }

  let data = fs::read_to_string(&messages_path).expect("Failed to read the INTERNAL_DATA_PATH file correctly.");
  let message: Vec<Message> = serde_json::from_str(&data).expect("Converting str to JSON failed.");

  return message;
}

fn save_internal_data(messages: Vec<Message>) {
  let messages_path = data_dir().expect("data_dir() failed inside of save_internal_data.").join("YouAreTyping/messages.json");

  let messages_string = serde_json::to_string(&messages).expect("Failed to convert serde_json to string.");

  fs::write(&messages_path, messages_string).expect("Saving String to INTERNAL_DATA_PATH failed.");
}

#[tauri::command(rename_all = "snake_case")]
fn save_message(content: String, author: String, timestamp: i64) {
  let mut old_messages = get_internal_data();

  old_messages.push(Message {content: content.to_string(), author: author.to_string(), timestamp});
  save_internal_data(old_messages);
}

#[tauri::command]
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
