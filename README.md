# You Are Typing

![You Are Typing header](.github/header.png)

You Are Typing allows you to have a conversation with yourself and be kinder to
yourself. It does this by allowing you to send text messages and switching
the perspective of the text messages, making it seem like the texts you sent are
texts you received.

## Installation

In order to install the app, you have to compile it yourself. You can do so by:

```shell
# cloning the repo
git clone https://github.com/calejvaldez/YouAreTyping.git
cd YouAreTyping

# installing dependencies
npm i
cargo install tauri-cli

# and finally, building
cargo tauri build
```

Your build will be available in `/src-tauri/target/release/bundle/`.

## Roadmap

### v1.0

- [ ] Have program automatically scroll to end
- [ ] Add Markdown support
- [ ] Activate the
      [Tauri Updater](https://tauri.app/v1/guides/distribution/updater)

### v1.1

- [ ] Add way to reply to messages
- [ ] Convert from `.json` to `.db` for data storage

### v1.2

- [ ] Add way to bookmark/pin messages

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
