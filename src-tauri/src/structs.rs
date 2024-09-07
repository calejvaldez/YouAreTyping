use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub color: String,
    pub color_asked: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub content: String,
    pub author: String,
    pub timestamp: i64,
}

#[derive(Serialize, Deserialize)]
pub struct JsonMessage {
    pub content: String,
    pub author: String,
    pub timestamp: i64,
}
