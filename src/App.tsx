/*
App.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

The first thing users see when they start You Are Typing.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useEffect, useState } from "react";
import MessageInput from "./components/MessageInput";
import { Messages, Message } from "./components/Messages";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";

interface Config {
    color: string;
    color_asked: boolean;
}

function App() {
    const [switched, setSwitched] = useState(false);
    const [messages, setMessages] = useState([] as Message[]);
    const [messageColor, setMessageColor] = useState("");

    listen("tauri://menu", (event) => {
        if (event.payload === "filter_urls") {
            invoke("get_filtered_messages", { filter: "URL" }).then(
                (messages) => {
                    setMessages(messages as Message[]);
                },
            );
        } else if (event.payload === "filter_reset") {
            invoke("get_messages").then((messages) => {
                setMessages(messages as Message[]);
            });
        }
    });

    useEffect(() => {
        invoke("get_config")
            .then((config) => {
                setMessageColor((config as Config).color);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <div id="view">
            <Messages
                switched={switched}
                messages={messages}
                setMessages={setMessages}
                messageColor={messageColor}
            />
            <MessageInput
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
                setMessageColor={setMessageColor}
            />
        </div>
    );
}

export default App;
