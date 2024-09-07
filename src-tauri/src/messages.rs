/*
messages.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Has to do with managing messages users send.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Message {
    pub id: String,
    pub content: String,
    pub author: String,
    pub timestamp: i64,
}

pub fn delete_all_messages(app: &AppHandle) {
    let p = app
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .join("YouAreTyping.db");

    let conn = Connection::open(p).unwrap();

    conn.execute("DELETE FROM message", []).unwrap();
    app.restart();
}

pub fn get_all_messages(app: &AppHandle) -> Vec<Message> {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();
    let mut messages: Vec<Message> = vec![];

    let mut stmt = conn
        .prepare("SELECT * FROM message ORDER BY time_stamp DESC")
        .expect("SELECT * FROM message statement failed.");
    for msg in stmt
        .query_map([], |row| {
            Ok(Message {
                id: row.get(0)?,
                author: row.get(1)?,
                content: row.get(2)?,
                timestamp: row.get(3)?,
            })
        })
        .expect("Transferring db to Message struct failed.")
    {
        messages.push(msg.unwrap());
    }

    return messages;
}

pub fn save_message(app: &AppHandle, content: String, author: String, timestamp: i64) {
    if !["self".to_string(), "other".to_string()].contains(&author) {
        panic!("'author' must be 'self' or 'other', not {author:?}.")
    }

    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db"))
        .expect("Connection in save_message failed.");

    conn.execute(
        "INSERT INTO message(id, author, content, time_stamp) VALUES (?1, ?2, ?3, ?4)",
        (Uuid::new_v4().to_string(), author, content, timestamp),
    )
    .unwrap();
}
