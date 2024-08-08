/*
export-messages.rs
Carlos Valdez

This program converts the data you have in your `YouAreTyping.db` file that can
be found somewhere here:

https://docs.rs/tauri/latest/tauri/api/path/fn.data_dir.html

... and converts it from a `.db` file to a `messages.json` file. It'll ask you
where you want the document saved.

Eventually, this file will become part of the main program. But for now, it'll
stay here.


To run this program, please do the following commands:

```shell
cd tools

rustc export-messages.rs
./export-messages
```

*/

fn main() {
    println!("Hello world!");
}
