use std::{fs, path::PathBuf};

/*
config.rs
Carlos Valdez

Meant to help with the configuration of the app, stored in a `config.json`
file in the data_dir().
*/
use serde::{Deserialize, Serialize};
use tauri::api::path::data_dir;

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub color: String,
    pub color_asked: bool,
}

pub fn create_config_file() {
    let p = data_dir().expect("data_dir() failed.").join("YouAreTyping/config.json");
    let template_config = Config {
        color: "#38768b".to_string(),
        color_asked: false,
    };

    commit(p, &template_config);
}

pub fn set_color(color: String) {
    let p = data_dir().expect("data_dir() failed.").join("YouAreTyping/config.json");
    let config = get_full_config();

    let new_config = Config {
        color,
        color_asked: config.color_asked,
    };

    commit(p, &new_config);
}

pub fn set_color_asked(value: bool) {
    let p = data_dir().expect("data_dir() failed.").join("YouAreTyping/config.json");
    let config = get_full_config();

    let new_config = Config {
        color: config.color,
        color_asked: value
    };

    commit(p, &new_config);
}

pub fn get_full_config() -> Config {
    let p = data_dir().expect("data_dir() failed.").join("YouAreTyping/config.json");

    if !p.exists() {
        create_config_file();
    }

    let string_config = fs::read_to_string(&p).expect("Reading config file failed.");
    
    serde_json::from_str(&string_config).expect("Converting from str to JSON failed.")
}

fn commit(path: PathBuf, content: &Config) {
    fs::write(path, serde_json::to_string(content).expect("Failed to convert to string")).expect("Saving String to data_dir() failed.");
}
