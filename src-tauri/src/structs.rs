use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub color: String,
}

fn default_bookmark_value() -> i32 {
    0
}

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub content: String,
    pub author: String,
    pub timestamp: i64,
    #[serde(default = "default_bookmark_value")]
    pub bookmarked: i32,
}

#[derive(Serialize, Deserialize)]
pub struct JsonMessage {
    pub content: String,
    pub author: String,
    pub timestamp: i64,
}
