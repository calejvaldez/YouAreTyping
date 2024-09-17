/*
messages.rs
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Has to do with managing messages users send.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
use crate::structs::Message;
use chrono::{DateTime, Datelike, Local, Timelike};
use rusqlite::{named_params, Connection};
use std::path::PathBuf;
use tauri::AppHandle;
use uuid::Uuid;

const MONTHS: [&str; 12] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

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

fn requires_timestamp(old_timestamp: i64, current_timestamp: i64) -> (bool, Option<Message>) {
    let current_dt = DateTime::from_timestamp(current_timestamp, 0)
        .unwrap()
        .with_timezone(&Local::now().timezone())
        .with_hour(0)
        .unwrap()
        .with_minute(0)
        .unwrap()
        .with_second(0)
        .unwrap();
    let last_dt = DateTime::from_timestamp(old_timestamp, 0)
        .unwrap()
        .with_timezone(&Local::now().timezone())
        .with_hour(0)
        .unwrap()
        .with_minute(0)
        .unwrap()
        .with_second(0)
        .unwrap();

    if last_dt.timestamp() > current_dt.timestamp() {
        let (weekday, year, month, day) = (
            last_dt.weekday().to_string(),
            last_dt.year(),
            MONTHS[(last_dt.month() - 1) as usize],
            last_dt.day(),
        );
        let hr_midnight = format!("{weekday}, {month} {day}, {year}");

        return (
            true,
            Some(Message {
                id: last_dt.timestamp().to_string(),
                content: hr_midnight.clone(),
                author: "system".to_string(),
                timestamp: last_dt.timestamp(),
                bookmarked: 0,
            }),
        );
    }

    (false, None)
}

pub fn fetch_messages(app: &AppHandle, limit: Option<i32>) -> Vec<Message> {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();
    let mut messages: Vec<Message> = vec![];
    let count = if limit.is_none() { 50 } else { limit.unwrap() };
    let mut old_timestamp = 0;

    let mut stmt = conn
        .prepare("SELECT * FROM message ORDER BY time_stamp DESC LIMIT :count")
        .unwrap();
    for msg in stmt
        .query_map(named_params! {":count": count}, |row| {
            Ok(Message {
                id: row.get(0)?,
                author: row.get(1)?,
                content: row.get(2)?,
                timestamp: row.get(3)?,
                bookmarked: row.get(4)?,
            })
        })
        .expect("Transferring db to Message struct failed.")
    {
        let current_message = msg.unwrap();
        let (should_add_timestamp, timestamp_message) =
            requires_timestamp(old_timestamp, current_message.timestamp);

        if should_add_timestamp {
            old_timestamp = current_message.timestamp;
            messages.push(timestamp_message.unwrap());
        } else if old_timestamp == 0 {
            old_timestamp = current_message.timestamp;
        }

        messages.push(current_message);
    }

    let last_message = messages.last();

    if !last_message.is_none() {
        let (_, timestamp_message) = requires_timestamp(last_message.unwrap().timestamp, 0);
        messages.push(timestamp_message.unwrap());
    }

    return messages;
}

pub fn change_message_bookmark(app: &AppHandle, id: String, bookmark: bool) {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();

    conn.execute(
        "UPDATE message SET bookmarked = ?1 WHERE id = ?2",
        (if bookmark { 1 } else { 0 }, id),
    )
    .unwrap();
}

pub fn get_messages_filtered_by(app: &AppHandle, filter: String) -> Vec<Message> {
    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();
    let mut messages = vec![];
    let mut old_timestamp = 0;

    match filter.as_str() {
        "URL" => {
            let mut stmt = conn
                .prepare("SELECT * FROM message WHERE content LIKE '%' || ? || '%' ORDER BY time_stamp DESC")
                .unwrap();

            for msg in stmt
                .query_map(["https://"], |row| {
                    Ok(Message {
                        id: row.get(0)?,
                        author: row.get(1)?,
                        content: row.get(2)?,
                        timestamp: row.get(3)?,
                        bookmarked: row.get(4)?,
                    })
                })
                .expect("Transferring db to Message struct failed.")
            {
                let current_message = msg.unwrap();
                let (should_add_timestamp, timestamp_message) =
                    requires_timestamp(old_timestamp, current_message.timestamp);

                if should_add_timestamp {
                    old_timestamp = current_message.timestamp;
                    messages.push(timestamp_message.unwrap());
                } else if old_timestamp == 0 {
                    old_timestamp = current_message.timestamp;
                }

                messages.push(current_message);
            }
        }
        "bookmarks" => {
            let mut stmt = conn
                .prepare("SELECT * FROM message WHERE bookmarked = 1 ORDER BY time_stamp DESC")
                .unwrap();

            for msg in stmt
                .query_map([], |row| {
                    Ok(Message {
                        id: row.get(0)?,
                        author: row.get(1)?,
                        content: row.get(2)?,
                        timestamp: row.get(3)?,
                        bookmarked: row.get(4)?,
                    })
                })
                .expect("Transferring db to Message struct failed.")
            {
                let current_message = msg.unwrap();
                let (should_add_timestamp, timestamp_message) =
                    requires_timestamp(old_timestamp, current_message.timestamp);

                if should_add_timestamp {
                    old_timestamp = current_message.timestamp;
                    messages.push(timestamp_message.unwrap());
                } else if old_timestamp == 0 {
                    old_timestamp = current_message.timestamp;
                }

                messages.push(current_message);
            }
        }
        _ => panic!("This filter type is unknown."),
    }
    let last_message = messages.last();

    if !last_message.is_none() {
        let (_, timestamp_message) = requires_timestamp(last_message.unwrap().timestamp, 0);
        messages.push(timestamp_message.unwrap());
    }
    messages
}

fn with_timestamp(app_data_dir: PathBuf, new_timestamp: i64) -> Option<Message> {
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db")).unwrap();
    let mut messages: Vec<Message> = vec![];

    let mut stmt = conn
        .prepare("SELECT * FROM message ORDER BY time_stamp DESC LIMIT 1")
        .unwrap();
    for msg in stmt
        .query_map([], |row| {
            Ok(Message {
                id: row.get(0)?,
                author: row.get(1)?,
                content: row.get(2)?,
                timestamp: row.get(3)?,
                bookmarked: row.get(4)?,
            })
        })
        .expect("Transferring db to Message struct failed.")
    {
        messages.push(msg.unwrap());
    }

    if messages.len() == 0 {
        let today = Local::now()
            .with_hour(0)
            .unwrap()
            .with_minute(0)
            .unwrap()
            .with_second(0)
            .unwrap();

        let (weekday, year, month, day) = (
            today.weekday().to_string(),
            today.year(),
            MONTHS[(today.month() - 1) as usize],
            today.day(),
        );
        let hr_midnight = format!("{weekday}, {month} {day}, {year}");

        return Some(Message {
            id: today.timestamp().to_string(),
            content: hr_midnight,
            author: "system".to_string(),
            timestamp: today.timestamp(),
            bookmarked: 0,
        });
    } else if messages.len() > 0 {
        let (need_timestamp, ts_message) = requires_timestamp(new_timestamp, messages[0].timestamp);

        if need_timestamp {
            return ts_message;
        }
    }

    None
}

pub fn save_message(
    app: &AppHandle,
    content: String,
    author: String,
    timestamp: i64,
) -> Vec<Message> {
    if !["self".to_string(), "other".to_string()].contains(&author) {
        panic!("'author' must be 'self' or 'other', not {author:?}.")
    }

    let timestamp_message = with_timestamp(app.path_resolver().app_data_dir().unwrap(), timestamp);

    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db"))
        .expect("Connection in save_message failed.");
    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO message(id, author, content, time_stamp, bookmarked) VALUES (?1, ?2, ?3, ?4, 0)",
        (&id, &author, &content, &timestamp),
    )
    .unwrap();

    let message = Message {
        id,
        content,
        author,
        timestamp,
        bookmarked: 0,
    };

    if timestamp_message.is_some() {
        return vec![message, timestamp_message.unwrap()];
    } else {
        return vec![message];
    }
}
