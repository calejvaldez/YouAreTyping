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

I don't really expect anybody to contribute to this project. However, I wrote
this guide for two reasons:

1. You found this program useful and wanted to find a way to improve upon it
2. [I go another year without working on this program](https://github.com/calejvaldez/YouAreTyping/commits/main/?since=2023-06-20&until=2024-07-27)
    and want to improve upon it myself

So, here we go!

### License

This work is under the GNU General Public License v3.0.

## Non-code contributions

### Design

I don't put too much time thinking about the design of the program. I just made
a simple iMessage-like experience, though clearly it doesn't look that way. You
could try to come up with designs and I could see if it's possible to implement
or not. Open an issue and see what happens!

### Reporting bugs

You can open an issue to report bugs. I'll try to fix them as soon as I can,
though I don't promise anything. Here's a good example of a code report:
[ojosproject/website#24](https://github.com/ojosproject/website/issues/24/)

This repository comes with templates to help you properly structure your bug
report.

### Can I suggest a feature?

You *can*, but I might not implement it myself. I'm a college student already
struggling to keep up with everything, so it'll be difficult to find time to
implement a suggested feature.

However, I recommend you open an issue and *hopefully* somebody will decide
to code that feature and open a Pull Request. I'm more than open to merging
Pull Requests for suggested features!

## Code Contributions

### Branching Rules

If you plan to contribute code, please create a fork of this project and open
a PR targeted towards the `main` branch.

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

cargo tauri dev # run the dev environment
```

### Compiling

Before finalizing your PR, please compile the program and make sure the build
works.

```shell
cargo tauri build
```

Your build will be available in `/src-tauri/target/release/bundle/`

## Structure

### Frontend v. Backend

The frontend code is inside of the `src` folder. The backend code is in
`/src-tauri/src/`.

### Saved Data

Starting in version 1.0.4, all data is saved in a `YouAreTyping.db` file saved
in
[the `data_dir()` folder](https://docs.rs/tauri/1.7.1/tauri/api/path/fn.data_dir.html).

- On Windows, it is located in `C:\Users\[username]\AppData\Roaming\YouAreTyping\`
- On macOS, it is located in `/Users/[username]/Library/Application Support/YouAreTyping/`
- On Linux, it is located in `/home/[username]/.local/share/YouAreTyping/`
