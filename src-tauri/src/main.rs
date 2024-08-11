// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod conversion;
mod messages;
use uuid::Uuid;
use messages::{save_internal_data, get_internal_data, Message};
use conversion::export_to_json;

#[tauri::command(rename_all = "snake_case")]
fn save_message(content: String, author: String, timestamp: i64) {
  save_internal_data(Message {id: Uuid::new_v4().to_string(), content: content.to_string(), author: author.to_string(), timestamp});
}

#[tauri::command(rename_all = "snake_case")]
fn get_messages() -> Vec<Message> {
  get_internal_data()
}

#[tauri::command]
fn export_messages() {
  export_to_json();
}

fn main() {
  let _ = fix_path_env::fix();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_message, get_messages, export_messages])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
