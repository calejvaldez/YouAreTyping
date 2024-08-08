# Exporting/Importing Messages

![You Are Typing header](../.github/assets/header.png)

Exporting and importing your messages from You Are Typing isn't too difficult
of a process. As the developer, I'm a bit surprised how well this goes!

## Exporting your data

To export your data, make sure the input bar is focused. Then, press
`Control` + `e`. A folder will appear asking where to save your file. Select
the folder, and you will find a `messages.json` file waiting for you.

## Importing your data

> [!WARNING]
> By importing your data, you are also **destroying existing data** that was
> not imported. This action will also **delete the `messages.json` file** you
> place inside of requested folder.

Importing is a bit more complicated, but still rather easy. First, [figure out
where your app's data is located in](https://docs.rs/tauri/latest/tauri/api/path/fn.data_dir.html).
Then, go to that folder and locate `YouAreTyping.db`. Delete that file, and
place a copy of `messages.json` in that folder. The next time you launch You Are
Typing, all of the data in `messages.json` will be converted into a fresh
`YouAreTyping.db` file.
