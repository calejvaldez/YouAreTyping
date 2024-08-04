# You Are Typing Contributing Guidelines

![You Are Typing header](.github/assets/header.png)

## Table of Contents

- [You Are Typing Contributing Guidelines](#you-are-typing-contributing-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
    - [License](#license)
  - [Non-code contributions](#non-code-contributions)
    - [Design](#design)
    - [Reporting bugs](#reporting-bugs)
    - [Can I suggest a feature?](#can-i-suggest-a-feature)
  - [Code Contributions](#code-contributions)
    - [Branching Rules](#branching-rules)
    - [Setting up your environment](#setting-up-your-environment)
    - [Development](#development)
    - [Compiling](#compiling)
  - [Structure](#structure)
    - [Frontend v. Backend](#frontend-v-backend)
    - [Saved Data](#saved-data)

## Introduction

I don't exactly expect anybody to contribute to this project. For the most part,
I designed this for myself to help me organize my thoughts when I'm going
through a rough patch. However, this guide is here for two reasons.

1. You found this program useful and wanted to find a way to improve upon it
2. I go another year without working on this program, have another mental health
   crisis, and need to focus on something

So, here we go!

### License

This work is under the GNU General Public License 3.0.

## Non-code contributions

### Design

I don't put too much time thinking about the design of the program. I just made
a simple iMessage-like experience, though clearly it doesn't look that way. You
could try to come up with designs and I could see if it's possible to implement
or not. Open an issue and see what happens!

### Reporting bugs

You can open an issue to report bugs. I'll try to fix them as soon as I can,
though I don't promise anything. Here's a good example of a code report:
ojosproject/website#24

### Can I suggest a feature?

You *can*, but unless it's something I'm particularly interested in making, then
I won't add it. As of writing this, I'm a college student and don't code as
often as I used to. Even now the reason why I'm focusing a lot on this is
because I'm on summer break attempting to learn [Tauri](https://tauri.app/) for
[my research project](https://ojosproject.org/iris/).

You can suggest a feature by opening an issue and hoping someone decides to
work on it.

## Code Contributions

### Branching Rules

If you plan to contribute code, please create a fork of this project and open
a PR targeted towards the `dev` branch. **Do not aim at the `main` branch.**
The `main` branch is for the latest, stable release.

### Setting up your environment

The following tools are used for this program:

- [Tauri](https://tauri.app/)
- For the frontend...
  - [Vite](https://vitejs.dev/)
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
- For the backend...
  - [Rust](https://rust-lang.org/)

Please follow
[this guide by Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)
to get started.

Once you've installed the prerequisites, clone the repository:

```shell
git clone https://github.com/calejvaldez/YouAreTyping.git
cd YouAreTyping
```

### Development

Before you can start coding, you need to:

```shell
npm i # install npm dependencies
cargo install tauri-cli # install the Tauri CLI

cargo tauri dev # run dev mode
```

### Compiling

```shell
cargo tauri build
```

Your build will be available in `/src-tauri/target/release/bundle/`

## Structure

### Frontend v. Backend

The frontend code is inside of the `src` folder. The backend code is in
`/src-tauri/src/`.

### Saved Data

Until version 1.1, You Are Typing saves a `messages.json` file in your operating
system's data directory as dictated by Tauri's `data_dir()` function.
[Learn more here](https://docs.rs/tauri/1.7.1/tauri/api/path/fn.data_dir.html).
Starting on version 1.1, it will instead be a  `.db` file.

- On Windows, it is located in `{FOLDERID_RoamingAppData}`
- On macOS, it is located in `$HOME/Library/Application Support/YouAreTyping/`
- On Linux, it is located in `$HOME/.local/share/YouAreTyping/`

> [!NOTE]
> I do not test on Windows, so I do not know if the Windows path is accurate.
> Let me know!
