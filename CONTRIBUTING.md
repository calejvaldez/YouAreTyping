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
    - [Testing](#testing)
      - [Scenario Testing](#scenario-testing)
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

- [Tauri v1](https://tauri.app/)
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

### Testing

You must test on every OS that YAT exists on. I don't expect you to test on
every architecture, though.

As of September 2024, releases are made for **macOS** and **Windows**.

> [!IMPORTANT]
> If you're submitting a PR and don't have access to both operating systems,
> please find a friend to test with and vouch for you.

It's safe to assume that any previous changes work on all operating systems.
However, it is *not* safe to assume that your changes work on every system.

Test only your changes, unless you're attempting to find bugs, which is cool
too.

#### [Scenario Testing](https://en.wikipedia.org/wiki/Scenario_testing)

Come up with specific scenarios that relate to your feature / bug fix. For
example, with commit b41e4c80e497d6f6957b2d4306e3ec4440f60c12, here is a
scenario I used to test my features:

- A user has an old `YouAreTyping` data folder with `YouAreTyping.db` full of
  messages. Ensure that all of those messages are properly imported to
  `com.calejvaldez.YouAreTyping/YouAreTyping.db`

You should test each scenario on every OS that YAT releases on.

## Structure

### Frontend v. Backend

The frontend code is inside of the `src` folder. The backend code is in
`/src-tauri/src/`.

### Saved Data

Starting in version 1.3.3, all data is saved in a `YouAreTyping.db` file saved
in
[the `app_data_dir()` folder](https://docs.rs/tauri/latest/tauri/api/path/fn.app_data_dir.html).

- On Windows, it is located in `C:\Users\[username]\AppData\Roaming\com.calejvaldez.YouAreTyping\`
- On macOS, it is located in `/Users/[username]/Library/Application Support/com.calejvaldez.YouAreTyping/`
- On Linux, it is located in `/home/[username]/.local/share/com.calejvaldez.YouAreTyping/`
