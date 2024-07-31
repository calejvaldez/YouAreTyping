# You Are Typing

![You Are Typing header](.github/header.png)

## Table of Contents

- [You Are Typing](#you-are-typing)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
    - [Background](#background)
    - [Features](#features)
  - [Installation](#installation)
    - ["You Are Typing is damaged and can’t be opened" Error on macOS](#you-are-typing-is-damaged-and-cant-be-opened-error-on-macos)
  - [Support](#support)
  - [Roadmap](#roadmap)
    - [v1.0](#v10)
    - [v1.1](#v11)
    - [v1.2](#v12)
  - [Contributing](#contributing)
  - [License](#license)

## Description

You Are Typing allows you to have a conversation with yourself and be kinder to
yourself. It does this by allowing you to send text messages and switching
the perspective of the text messages, making it seem like the texts you sent are
texts you received.

### Background

I created this program to help me get through rough moments in life. Sometimes
checking in with yourself through a text conversation has been helpful for me,
so maybe it'll be helpful to you too.

### Features

- A text messaging app-like experience
- Switch perspectives with `Enter` + `Control`
- Markdown support for sent messages

## Installation

In order to install the app, you have to compile it yourself. Please view the
[`CONTRIBUTING`](./CONTRIBUTING.md#setting-up-your-environment) document for
more information.

### "You Are Typing is damaged and can’t be opened" Error on macOS

If you get this error on macOS, it's because I am not an identified developer
and will not spend the $100 for Apple. 💞

After installing the application with the `.dmg` file, you must run the
following command on the terminal:

```shell
xattr -c /Applications/'You Are Typing.app'
```

## Support

If you need any help, please open a GitHub issue and I'll try to get on it soon.

## Roadmap

### v1.0

- [ ] Have program automatically scroll to end
- [x] Add Markdown support
- [x] Activate the
      [Tauri Updater](https://tauri.app/v1/guides/distribution/updater)

### v1.1

- [ ] Add way to reply to messages
- [ ] Convert from `.json` to `.db` for data storage

### v1.2

- [ ] Add way to bookmark/pin messages

## Contributing

I don't expect people to contribute to this project, but if you're curious,
please read the [`CONTRIBUTING`](./CONTRIBUTING.md) document.

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
