// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod conversion;
mod messages;
mod config;
use uuid::Uuid;
use messages::{save_internal_data, get_internal_data, Message};
use conversion::export_to_json;
use config::{get_color_from_config, get_full_config, set_color, set_color_asked, Config};

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

#[tauri::command]
fn get_config() -> Config {
  get_full_config()
}

#[tauri::command(rename_all = "snake_case")]
fn set_color_config(color: String) {
  set_color(color);
}

#[tauri::command(rename_all = "snake_case")]
fn set_color_config_asked(value: bool) {
  set_color_asked(value);
}

fn main() {
  let _ = fix_path_env::fix();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_message, get_messages, export_messages, get_config, set_color_config, set_color_config_asked])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
