/*
main.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Sets the commands for the program and starts said program.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod conversion;
mod menu;
mod messages;
mod setup;
mod structs;
use config::{get_full_config, set_color};
use conversion::{export_to_csv, export_to_json, import_as_json};
use menu::{handle_menu_event, menu};
use messages::{
    change_message_bookmark, delete_all_messages, fetch_messages, get_messages_filtered_by,
    save_message as save_to_db,
};
use setup::handle_setup;
use std::env;
use structs::{Config, Message};
use tauri::{api::dialog, AppHandle, Manager};

#[tauri::command(rename_all = "snake_case")]
fn save_message(app: AppHandle, content: String, author: String, timestamp: i64) -> Vec<Message> {
    save_to_db(&app, content, author, timestamp)
}

#[tauri::command(rename_all = "snake_case")]
fn get_messages(app: AppHandle, limit: Option<i32>) -> Vec<Message> {
    fetch_messages(&app, limit)
}

#[tauri::command(rename_all = "snake_case")]
fn get_filtered_messages(app: AppHandle, filter: String) -> Vec<Message> {
    get_messages_filtered_by(&app, filter)
}

#[tauri::command]
fn get_config(app: AppHandle) -> Config {
    get_full_config(&app)
}

#[tauri::command(rename_all = "snake_case")]
fn set_color_config(app: AppHandle, color: String) {
    set_color(&app, color);
}

#[tauri::command(rename_all = "snake_case")]
fn toggle_bookmark_message(app: AppHandle, id: String, bookmark: bool) {
    change_message_bookmark(&app, id, bookmark);
}

#[tauri::command(rename_all = "snake_case")]
fn export_to(app: AppHandle, to_format: String) {
    if to_format == "json" {
        export_to_json(&app);
    } else if to_format == "csv" {
        export_to_csv(&app);
    } else {
        panic!("Only JSON or CSV formats are supported.");
    }
}

#[tauri::command]
fn import(app: AppHandle) {
    import_as_json(&app);
}

#[tauri::command]
fn delete(app: AppHandle) {
    std::thread::spawn(move || {
        let should_continue = dialog::blocking::ask(app.get_window("main").as_ref(), "Delete all messages?", "Deleting all messages is an irreversible action. Please be sure you've exported your messages as JSON before continuing.");
        if should_continue {
            delete_all_messages(&app);
        }
    });
}

fn main() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
        .menu(menu(env::consts::OS))
        .on_menu_event(handle_menu_event)
        .setup(handle_setup)
        .invoke_handler(tauri::generate_handler![
            save_message,
            get_messages,
            get_config,
            set_color_config,
            get_filtered_messages,
            toggle_bookmark_message,
            export_to,
            import,
            delete
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
