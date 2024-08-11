import { useEffect, useRef, useState } from "react";
import "./App.scss";
import MessageInput from "./components/MessageInput";
import { Messages, Message } from "./components/Messages";
import { invoke } from "@tauri-apps/api";

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
                if (!(config as Config).color_asked) {
                    // dialog, ask

                    invoke("set_color_config_asked", { value: true });
                }

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
            />
        </div>
    );
}

export default App;
