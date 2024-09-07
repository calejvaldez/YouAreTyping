/*
menu.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Creates the menu for the program.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use crate::{
    conversion::{export_to_csv, export_to_json, import_as_json},
    messages::delete_all_messages,
};
use tauri::{
    api::{dialog, shell},
    AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowMenuEvent,
};

/// # "App" Submenu
///
/// This includes the regular things you may find in a macOS App submenu, such
/// as About App, Services, Hide, Hide Others, Show All, and Quit.
///
/// ## OS Support
///
/// - macOS: Fully supported
fn submenu_app() -> Submenu {
    Submenu::new(
        "App",
        Menu::new()
            .add_native_item(MenuItem::About(
                "You Are Typing".to_string(),
                AboutMetadata::new(), // needed for function, but not used
            ))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Services)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::ShowAll)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    )
}

/// # "File" Submenu
///
/// This is a custom submenu for all operating systems. It includes options
/// created for You Are Typing.
///
/// ## OS Support
///
/// - Windows: Fully supported
/// - macOS: Fully supported
/// - Linux: Fully supported
fn submenu_file() -> Submenu {
    Submenu::new(
        "File",
        Menu::new()
            .add_item(CustomMenuItem::new("import_json", "Import JSON...").accelerator("Ctrl+I"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("export_json", "Export JSON..."))
            .add_item(CustomMenuItem::new("export_csv", "Export CSV...").accelerator("Ctrl+E"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new(
                "delete_messages",
                "Delete All Messages",
            )),
    )
}

/// # "Edit" Submenu
///
/// A submenu that includes usually text-editing shortcuts, such as Cut, Copy,
/// and Paste.
///
/// ## OS Support
///
/// - Windows: Partially (Cut, Copy, Paste, Select All)
/// - macOS: Fully supported
fn submenu_edit(target_os: &str) -> Submenu {
    match target_os {
        "windows" => Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::SelectAll),
        ),
        "macos" => Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(MenuItem::Undo)
                .add_native_item(MenuItem::Redo)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::SelectAll),
        ),
        _ => panic!("Unsupported operating system attempting to use Edit submenu."),
    }
}

/// # "View" Submenu
///
/// The View submenu only includes the Enter Full Screen option.
///
/// ## OS Support
///
/// - macOS: Fully supported
fn submenu_view() -> Submenu {
    Submenu::new(
        "View",
        Menu::new().add_native_item(MenuItem::EnterFullScreen),
    )
}

/// # "Window" Submenu
///
/// Includes Minimize, Zoom, and Close Window.
///
/// ## OS Support
///
/// - Windows: Fully supported
/// - macOS: Fully supported
fn submenu_window() -> Submenu {
    Submenu::new(
        "Window",
        Menu::new()
            .add_native_item(MenuItem::Minimize)
            .add_native_item(MenuItem::Zoom)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow),
    )
}

/// # "Help" Submenu
///
/// This submenu is used to provide support links, sending people to the GitHub
/// repository.
///
/// ## OS Support
///
/// - Windows: Fully supported
/// - macOS: Fully supported
/// - Linux: Fully supported
fn submenu_help() -> Submenu {
    Submenu::new(
        "Help",
        Menu::new()
            .add_item(CustomMenuItem::new("help_user_guide", "User Guide"))
            .add_item(CustomMenuItem::new(
                "help_release_notes",
                "Show Release Notes",
            ))
            .add_item(CustomMenuItem::new("help_report_bug", "Report a Bug"))
            .add_item(CustomMenuItem::new("help_github", "View on GitHub")),
    )
}

pub fn menu(target_os: &str) -> Menu {
    match target_os {
        "windows" => Menu::new()
            .add_submenu(submenu_file())
            .add_submenu(submenu_edit(target_os))
            .add_submenu(submenu_window())
            .add_submenu(submenu_help()),
        "macos" => Menu::new()
            .add_submenu(submenu_app())
            .add_submenu(submenu_file())
            .add_submenu(submenu_edit(target_os))
            .add_submenu(submenu_view())
            .add_submenu(submenu_window())
            .add_submenu(submenu_help()),
        "linux" => Menu::new()
            .add_submenu(submenu_file())
            .add_submenu(submenu_help()),
        _ => panic!("Unsupported operating system attempting to create a Menu."),
    }
}

/// Handles all the menu events.
pub fn handle_menu_event(event: WindowMenuEvent) {
    let app = event.window().app_handle();
    // all menu item ids can be found in menu.rs
    match event.menu_item_id() {
        "import_json" => {
            import_as_json(&app);
        }
        "export_json" => {
            export_to_json(&app);
        }
        "export_csv" => {
            export_to_csv(&app);
        }
        "delete_messages" => {
            std::thread::spawn(move || {
                let should_continue = dialog::blocking::ask(Some(event.window()), "Delete all messages?", "Deleting all messages is an irreversible action. Please be sure you've exported your messages as JSON before continuing.");
                if should_continue {
                    delete_all_messages(&app);
                }
            });
        }
        "help_user_guide" => {
            shell::open(
                &app.shell_scope(),
                "https://github.com/calejvaldez/YouAreTyping/blob/release/docs/guide.md",
                None,
            )
            .unwrap();
        }
        "help_report_bug" => {
            shell::open(
                &app.shell_scope(),
                "https://github.com/calejvaldez/YouAreTyping/issues/new/choose/",
                None,
            )
            .unwrap();
        }
        "help_release_notes" => {
            shell::open(
                &app.shell_scope(),
                "https://github.com/calejvaldez/YouAreTyping/releases/",
                None,
            )
            .unwrap();
        }
        "help_github" => {
            shell::open(
                &app.shell_scope(),
                "https://github.com/calejvaldez/YouAreTyping/",
                None,
            )
            .unwrap();
        }
        _ => {}
    }
}
