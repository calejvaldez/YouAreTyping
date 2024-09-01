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
use config::{get_full_config, set_color, set_color_asked, Config};
use conversion::{export_to_csv, export_to_json, import_as_json};
use menu::menu;
use messages::{get_internal_data, save_internal_data, Message};
use tauri::{
    api::{dialog, path::data_dir},
    Manager,
};
use uuid::Uuid;

#[tauri::command(rename_all = "snake_case")]
fn save_message(content: String, author: String, timestamp: i64) {
    save_internal_data(Message {
        id: Uuid::new_v4().to_string(),
        content: content.to_string(),
        author: author.to_string(),
        timestamp,
    });
}

#[tauri::command(rename_all = "snake_case")]
fn get_messages() -> Vec<Message> {
    get_internal_data()
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
    .menu(menu())
    .on_menu_event(|event| {
        match event.menu_item_id() {
            "import_json" => {import_as_json(event);},
            "export_json" => {export_to_json();}
            "export_csv" => {export_to_csv();}
            _ => {}
        }
    })
    .setup(|app| {
        let main_window = app.get_window("main").unwrap();

        if data_dir().expect("Data dir failed").join("YouAreTyping/").exists() && !get_config().color_asked {
            std::thread::spawn(move || {
                dialog::blocking::message(Some(&main_window), "Choose a color!", "Display the color picker using\n`Control` + `c`\nto change messages' colors!");

                set_color_asked(true);
            });
        }

        Ok(())
    })
    .invoke_handler(tauri::generate_handler![save_message, get_messages, get_config, set_color_config, set_color_config_asked])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
