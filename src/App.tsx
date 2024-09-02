/*
App.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

The first thing users see when they start You Are Typing.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useEffect, useRef, useState } from "react";
import MessageInput from "./components/MessageInput";
import { Messages, Message } from "./components/Messages";
import { invoke } from "@tauri-apps/api/core";

interface Config {
    color: string;
    color_asked: boolean;
}

function App() {
    const [switched, setSwitched] = useState(false);
    const [messages, setMessages] = useState([] as Message[]);
    const [messageColor, setMessageColor] = useState("");
    const scrollRef = useRef(null);

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
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
                scrollRef={scrollRef}
                messageColor={messageColor}
            />
            <MessageInput
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
                scrollRef={scrollRef}
                setMessageColor={setMessageColor}
            />
        </div>
    );
}

export default App;
