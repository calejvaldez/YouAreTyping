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
    - [Exporting your messages](#exporting-your-messages)
    - [Importing your messages](#importing-your-messages)

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
| `Control` + `c`     | Toggle color picker       |
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
messages on the right. You can toggle the color selector by pressing the
`Control` and `c` keys. On the top-right of the screen, a color selector will
appear for you to change the color of your messages.

### Exporting your messages

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

| Key         | Type                  | Description                          |
| ----------- | --------------------- | ------------------------------------ |
| `id`        | `string`              | The UUID of the message              |
| `timestamp` | `number`              | The Epoch timestamp of your message  |
| `author`    | `"self"` or `"other"` | The perspective the message was sent |
| `content`   | `string`              | The content of the message           |
