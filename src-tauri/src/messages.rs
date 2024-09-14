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
    if old_timestamp == 0 {
        return (false, None);
    }

    let current_dt = DateTime::from_timestamp(current_timestamp, 0)
        .unwrap()
        .with_timezone(&Local::now().timezone());
    let last_dt = DateTime::from_timestamp(old_timestamp, 0)
        .unwrap()
        .with_timezone(&Local::now().timezone());

    if last_dt.day() > current_dt.day() {
        let midnight = last_dt
            .with_hour(0)
            .unwrap()
            .with_minute(0)
            .unwrap()
            .with_second(0)
            .unwrap();
        let ts_midnight = midnight.timestamp();
        let (year, month, day) = (
            midnight.year(),
            MONTHS[(midnight.month() - 1) as usize],
            midnight.day(),
        );
        let hr_midnight = format!("{month} {day}, {year}");

        return (
            true,
            Some(Message {
                id: "".to_string(),
                content: hr_midnight.clone(),
                author: "system".to_string(),
                timestamp: ts_midnight,
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
    let count = if limit.is_none() { 100 } else { limit.unwrap() };
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
                messages.push(msg.unwrap());
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
                messages.push(msg.unwrap());
            }
        }
        _ => panic!("This filter type is unknown."),
    }

    messages
}

pub fn save_message(app: &AppHandle, content: String, author: String, timestamp: i64) -> Message {
    if !["self".to_string(), "other".to_string()].contains(&author) {
        panic!("'author' must be 'self' or 'other', not {author:?}.")
    }

    let app_data_dir = app.path_resolver().app_data_dir().unwrap();
    let conn = Connection::open(app_data_dir.join("YouAreTyping.db"))
        .expect("Connection in save_message failed.");
    let id = Uuid::new_v4().to_string();

    conn.execute(
        "INSERT INTO message(id, author, content, time_stamp, bookmarked) VALUES (?1, ?2, ?3, ?4, 0)",
        (&id, &author, &content, &timestamp),
    )
    .unwrap();

    Message {
        id,
        content,
        author,
        timestamp,
        bookmarked: 0,
    }
}
