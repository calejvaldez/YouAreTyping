# You Are Typing User Guide

![You Are Typing header](../.github/assets/header.png)

## Table of Contents

- [You Are Typing User Guide](#you-are-typing-user-guide)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [All keyboard shortcuts](#all-keyboard-shortcuts)
  - [Features](#features)
    - [Texting yourself](#texting-yourself)
    - [Switching perspectives](#switching-perspectives)
    - [Changing message colors](#changing-message-colors)
    - [Bookmarking a message](#bookmarking-a-message)
    - [Filtering messages](#filtering-messages)
    - [Exporting your messages](#exporting-your-messages)
    - [Importing your messages](#importing-your-messages)
    - [Deleting your messages](#deleting-your-messages)
  - [Where is my data?](#where-is-my-data)

## Introduction

Welcome to the You Are Typing user guide! I'm glad you're interested in using
You Are Typing. I wrote this program to help myself organize my thoughts and
become my own best friend, as mentioned in the [`README.md` file](../README.md).

This document is here to outline what you can do with the program.

## All keyboard shortcuts

A *lot* of this program includes keyboard shortcuts to do basic tasks. To avoid
reading the entire guide, here's a quick table to use as reference:

| Key(s)              | Feature                   |
| ------------------- | ------------------------- |
| `Enter`             | Send a message            |
| `Control` + `Enter` | Switch perspectives       |
| `Control` + `e`     | Export messages as `.csv` |
| `Control` + `i`     | Import a `.json` file     |

## Features

### Texting yourself

The main highlight of YAT is that you can text yourself. You can send a simple
message by typing in the input bar at the bottom and selecting the `Enter` key.

### Switching perspectives

To make it seem like someone else is texting you, you can switch the perspective
of the text messages. That is, your messages will appear on the left, and the
"other" person's messages will appear on the right, making it seem like the
texts you sent came from someone else.

You can do this by selecting the `Control` and `Enter` keys at the same time.

### Changing message colors

If you'd like to customize your experience, you can change the color of the
messages on the right. Select the gear on the top-right of the screen to enter
Settings. Under "Colors", you can select the color you'd like!

### Bookmarking a message

When you hover over a message, you're presented with a bookmark icon and the
timestamp. To bookmark your a message, just press the bookmark icon and you're
all set!

### Filtering messages

You can filter your messages by going to the "Search" submenu on the Menu bar.
You will find options for filtering by bookmarks or by messages that include a
link.

Once you're done, you can select "Reset filters" to go back to normal messages.

### Exporting your messages

> [!IMPORTANT]
> The difference between a `.csv` and a `.json` is that a `.csv` is more for
> spreadsheet viewing programs, whereas `.json` is more for programming and
> importing back into You Are Typing.

You can export your messages as a comma separated values (`.csv`) file. This
format is best used for spreadsheet programs.

You can do so by using the `Control` and `e` keys at the same time.

You can also export your messages as a `.json` file by using the menu under the
"File" submenu.

### Importing your messages

You can only import a `.json` file. You can do so by pressing the `Control` +
`i` key.

In order to import a `.json` file, it has to be structured as a list of Message
objects, with the following keys:

| Key          | Type                  | Description                                 |
| ------------ | --------------------- | ------------------------------------------- |
| `id`         | `string`              | The UUID of the message                     |
| `timestamp`  | `number`              | The Epoch timestamp of your message         |
| `author`     | `"self"` or `"other"` | The perspective the message was sent        |
| `content`    | `string`              | The content of the message                  |
| `bookmarked` | `0` or `1`            | If the message is bookmarked (`1` = `true`) |

There are no plans to support importing from a `.csv`.

### Deleting your messages

Sometimes you may want to clear your message history. You can do so by using the
"Delete all messages" button inside of the "File" menu.

## Where is my data?

All data is stored in...

| Platform | Location                                                                      |
| -------- | ----------------------------------------------------------------------------- |
| Windows  | `C:\Users\[username]\AppData\Roaming\com.calejvaldez.YouAreTyping\`           |
| macOS    | `/Users/[username]/Library/Application Support/com.calejvaldez.YouAreTyping/` |
| Linux    | `/home/[username]/.local/share/com.calejvaldez.YouAreTyping/`                 |
