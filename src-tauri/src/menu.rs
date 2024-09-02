/*
menu.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Creates the menu for the program.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use tauri::{
    menu::{AboutMetadataBuilder, Menu, MenuBuilder, MenuItemBuilder, Submenu, SubmenuBuilder},
    AppHandle, Manager, Wry,
};
// ! Transition docs: https://v2.tauri.app/start/migrate/from-tauri-1/#migrate-to-menu

/// # "App" Submenu
///
/// This includes the regular things you may find in a macOS App submenu, such
/// as About App, Services, Hide, Hide Others, Show All, and Quit.
///
/// ## OS Support
///
/// - macOS: Fully supported
fn submenu_app(handle: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(handle, "App")
        .about(Some(AboutMetadataBuilder::new().build()))
        .separator()
        .services()
        .separator()
        .hide()
        .hide_others()
        .show_all()
        .separator()
        .quit()
        .build()
        .unwrap()
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
fn submenu_file(handle: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(handle, "File")
        .item(
            &MenuItemBuilder::new("Import JSON...")
                .id("import_json")
                .accelerator("Ctrl+I")
                .build(handle)
                .unwrap(),
        )
        .separator()
        .item(
            &MenuItemBuilder::new("Export JSON...")
                .id("export_json")
                .build(handle)
                .unwrap(),
        )
        .item(
            &MenuItemBuilder::new("Export CSV...")
                .id("export_csv")
                .accelerator("Ctrl+E")
                .build(handle)
                .unwrap(),
        )
        .separator()
        .item(
            &MenuItemBuilder::new("Delete All Messages")
                .id("delete_messages")
                .build(handle)
                .unwrap(),
        )
        .separator()
        .close_window()
        .build()
        .unwrap()
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
fn submenu_edit(handle: &AppHandle, target_os: &str) -> Submenu<Wry> {
    match target_os {
        "windows" => SubmenuBuilder::new(handle, "Edit")
            .cut()
            .copy()
            .paste()
            .select_all()
            .build()
            .unwrap(),
        "macos" => SubmenuBuilder::new(handle, "Edit")
            .undo()
            .redo()
            .separator()
            .cut()
            .copy()
            .paste()
            .select_all()
            .build()
            .unwrap(),
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
fn submenu_view(handle: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(handle, "View")
        .fullscreen()
        .build()
        .unwrap()
}

/// # "Window" Submenu
///
/// Includes Minimize, Zoom, and Close Window.
///
/// ## OS Support
///
/// - Windows: Fully supported
/// - macOS: Fully supported
fn submenu_window(handle: &AppHandle) -> Submenu<Wry> {
    // ? where's MenuItem::Zoom?
    SubmenuBuilder::new(handle, "Window")
        .minimize()
        .separator()
        .close_window()
        .build()
        .unwrap()
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
fn submenu_help(handle: &AppHandle) -> Submenu<Wry> {
    SubmenuBuilder::new(handle, "Help")
        .item(
            &MenuItemBuilder::new("User Guide")
                .id("help_user_guide")
                .build(handle)
                .unwrap(),
        )
        .item(
            &MenuItemBuilder::new("Show Release Notes")
                .id("help_release_notes")
                .build(handle)
                .unwrap(),
        )
        .item(
            &MenuItemBuilder::new("Report a Bug")
                .id("help_report_bug")
                .build(handle)
                .unwrap(),
        )
        .item(
            &MenuItemBuilder::new("View on GitHub")
                .id("help_github")
                .build(handle)
                .unwrap(),
        )
        .build()
        .unwrap()
}

pub fn menu(app: AppHandle, target_os: &str) -> Menu<Wry> {
    let handle = app.app_handle();
    match target_os {
        "windows" => MenuBuilder::new(handle)
            .item(&submenu_file(handle))
            .item(&submenu_edit(handle, target_os))
            .item(&submenu_window(handle))
            .item(&submenu_help(handle))
            .build()
            .unwrap(),
        "macos" => MenuBuilder::new(handle)
            .item(&submenu_app(handle))
            .item(&submenu_file(handle))
            .item(&submenu_edit(handle, target_os))
            .item(&submenu_view(handle))
            .item(&submenu_window(handle))
            .item(&submenu_help(handle))
            .build()
            .unwrap(),
        "linux" => MenuBuilder::new(handle)
            .item(&submenu_file(handle))
            .item(&submenu_help(handle))
            .build()
            .unwrap(),
        _ => panic!("Unsupported operating system attempting to create a Menu."),
    }
}
