/*
config.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Functions for interacting with the config file.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub color: String,
    pub color_asked: bool,
}

pub fn create_config_file(app_data_dir: PathBuf) {
    let p = app_data_dir.join("config.json");
    let template_config = Config {
        color: "#38768b".to_string(),
        color_asked: false,
    };

    commit(p, &template_config);
}

pub fn set_color(app_data_dir: PathBuf, color: String) {
    let p = app_data_dir.join("config.json");
    let config = get_full_config(app_data_dir);

    let new_config = Config {
        color,
        color_asked: config.color_asked,
    };

    commit(p, &new_config);
}

pub fn set_color_asked(app_data_dir: PathBuf, value: bool) {
    let p = app_data_dir.join("config.json");
    let config = get_full_config(app_data_dir);

    let new_config = Config {
        color: config.color,
        color_asked: value,
    };

    commit(p, &new_config);
}

pub fn get_full_config(app_data_dir: PathBuf) -> Config {
    let p = app_data_dir.join("config.json");

    if !p.exists() {
        create_config_file(app_data_dir);
    }

    let string_config = fs::read_to_string(&p).expect("Reading config file failed.");

    serde_json::from_str(&string_config).expect("Converting from str to JSON failed.")
}

fn commit(path: PathBuf, content: &Config) {
    fs::write(
        path,
        serde_json::to_string(content).expect("Failed to convert to string"),
    )
    .expect("Saving String to data_dir() failed.");
}
