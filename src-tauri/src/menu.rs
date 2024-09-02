/*
menu.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Creates the menu for the program.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

fn about_metadata() -> AboutMetadata {
    AboutMetadata::new()
        .authors(vec!["Carlos Valdez".to_string()])
        .license("GNU GPLv3")
        .website("https://github.com/calejvaldez/YouAreTyping/")
}

fn submenu_app() -> Submenu {
    Submenu::new(
        "App",
        Menu::new()
            .add_native_item(MenuItem::About(
                "You Are Typing".to_string(),
                about_metadata(),
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
                "Delete all messages",
            ))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::CloseWindow),
    )
}

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
        "linux" => Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::SelectAll),
        ),
        _ => Submenu::new("Edit", Menu::new()),
    }
}

fn submenu_view() -> Submenu {
    Submenu::new(
        "View",
        Menu::new().add_native_item(MenuItem::EnterFullScreen),
    )
}

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

pub fn menu(target_os: &str) -> Menu {
    match target_os {
        "windows" => Menu::new()
            .add_submenu(submenu_file())
            .add_submenu(submenu_edit(target_os))
            .add_submenu(submenu_window()),
        "macos" => Menu::new()
            .add_submenu(submenu_app())
            .add_submenu(submenu_file())
            .add_submenu(submenu_edit(target_os))
            .add_submenu(submenu_view())
            .add_submenu(submenu_window()),
        "linux" => Menu::new()
            .add_submenu(submenu_file())
            .add_submenu(submenu_edit(target_os))
            .add_submenu(submenu_window()),
        _ => Menu::new(),
    }
}
