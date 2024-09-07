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
use config::{get_full_config, set_color, set_color_asked, Config};
use menu::{handle_menu_event, menu};
use messages::{get_all_messages, save_message as save_to_db, Message};
use setup::handle_setup;
use std::env;
use tauri::AppHandle;

#[tauri::command(rename_all = "snake_case")]
fn save_message(app: AppHandle, content: String, author: String, timestamp: i64) {
    save_to_db(&app, content, author, timestamp);
}

#[tauri::command(rename_all = "snake_case")]
fn get_messages(app: AppHandle) -> Vec<Message> {
    get_all_messages(&app)
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
fn set_color_config_asked(app: AppHandle, value: bool) {
    set_color_asked(&app, value);
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
            set_color_config_asked
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
