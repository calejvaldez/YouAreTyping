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
use std::env;

use config::{get_full_config, set_color, set_color_asked, Config};
use conversion::{export_to_csv, export_to_json, import_as_json};
use menu::menu;
use messages::{delete_all_messages, get_internal_data, save_internal_data, Message};
use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_shell::ShellExt;
use uuid::Uuid;

#[tauri::command(rename_all = "snake_case")]
fn save_message(app: AppHandle, content: String, author: String, timestamp: i64) {
    save_internal_data(
        app,
        Message {
            id: Uuid::new_v4().to_string(),
            content: content.to_string(),
            author: author.to_string(),
            timestamp,
        },
    );
}

#[tauri::command(rename_all = "snake_case")]
fn get_messages(app: AppHandle) -> Vec<Message> {
    get_internal_data(app)
}

#[tauri::command]
fn get_config(app: AppHandle) -> Config {
    get_full_config(app)
}

#[tauri::command(rename_all = "snake_case")]
fn set_color_config(app: AppHandle, color: String) {
    set_color(app, color);
}

#[tauri::command(rename_all = "snake_case")]
fn set_color_config_asked(app: AppHandle, value: bool) {
    set_color_asked(app, value);
}

fn main() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .plugin(tauri_plugin_shell::init())
    .menu(menu(env::consts::OS))
    .setup(|app| {
        app.on_menu_event(move |app, event| {
            // all menu item ids can be found in menu.rs
            if event.id() == "import_json" {
                import_as_json(event);
            } else if event.id() == "export_json" {
                export_to_json(app.to_owned());
            } else if event.id() == "export_csv" {
                export_to_csv(app.to_owned());
            } else if event.id() == "delete_messages" {
                std::thread::spawn(move || {
                    let should_continue = app.dialog().message("Deleting all messages is an irreversible action. Please be sure you've exported your messages as JSON before continuing.").title("Delete all messages?").ok_button_label("Yes").cancel_button_label("Never mind").blocking_show();
                    if should_continue {
                        delete_all_messages(app.to_owned());
                    }
                });
            } else if event.id() == "help_user_guide" {
                app.shell().open("https://github.com/calejvaldez/YouAreTyping/blob/release/docs/guide.md", None).unwrap();
            } else if event.id() == "help_report_bug" {
                app.shell().open("https://github.com/calejvaldez/YouAreTyping/issues/new/choose/", None).unwrap();
            } else if event.id() == "help_release_notes" {
                app.shell().open("https://github.com/calejvaldez/YouAreTyping/releases/", None).unwrap();
            } else if event.id() == "help_github" {
                app.shell().open("https://github.com/calejvaldez/YouAreTyping/", None).unwrap();
            }
        });

        Ok(())
    })
    .invoke_handler(tauri::generate_handler![save_message, get_messages, get_config, set_color_config, set_color_config_asked])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
