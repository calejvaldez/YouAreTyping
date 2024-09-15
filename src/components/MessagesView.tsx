/*
MessagesView.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

View for messages and text input.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useEffect, useState } from "react";
import MessageInput from "./MessagesView/MessageInput";
import { MessagesScrollable } from "./MessagesView/MessagesScrollable";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { Config, Message } from "../types";

export default function MessageView() {
    const [switched, setSwitched] = useState(false);
    const [messages, setMessages] = useState([] as Message[]);
    const [messageColor, setMessageColor] = useState("");
    const [inputEnabled, setInputEnabled] = useState(true);
    const [messagesHeight, setMessagesHeight] = useState(93);

    listen("tauri://menu", (event) => {
        if (event.payload === "filter_urls") {
            invoke("get_filtered_messages", { filter: "URL" }).then(
                (messages) => {
                    setMessages(messages as Message[]);
                    setInputEnabled(false);
                },
            );
        } else if (event.payload === "filter_bookmarks") {
            invoke("get_filtered_messages", { filter: "bookmarks" }).then(
                (messages) => {
                    setMessages(messages as Message[]);
                    setInputEnabled(false);
                },
            );
        } else if (event.payload === "filter_reset") {
            invoke("get_messages").then((messages) => {
                setMessages(messages as Message[]);
                setInputEnabled(true);
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
            <MessagesScrollable
                switched={switched}
                messages={messages}
                messagesHeight={messagesHeight}
                setMessages={setMessages}
                messageColor={messageColor}
            />
            <MessageInput
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                messagesHeight={messagesHeight}
                setMessages={setMessages}
                setMessageColor={setMessageColor}
                setMessagesHeight={setMessagesHeight}
                inputEnabled={inputEnabled}
            />
        </div>
    );
}
