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

- [x] Setting an event handler for "Enter" and "Command+Enter"
- [ ] Connecting frontend and backend
  - [ ] Get content from backend
  - [ ] Send content to backend
- [ ] Have program automatically scroll to end

## License

No license for the moment, although the GNU GPLv3 is being considered.
