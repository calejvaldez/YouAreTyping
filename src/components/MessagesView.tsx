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
import SettingsIcon from "../assets/cog.svg";
import "./MessagesView.scss";

export default function MessageView(props: { setCurrentView: Function }) {
    const [switched, setSwitched] = useState(false);
    const [messages, setMessages] = useState([] as Message[]);
    const [messageColor, setMessageColor] = useState("");
    const [inputEnabled, setInputEnabled] = useState(true);
    const [messagesHeight, setMessagesHeight] = useState(93);
    const [showOnboarding, setShowOnboarding] = useState(false);

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
        invoke<Config>("get_config")
            .then((config) => {
                setShowOnboarding(config.new_user);
                if (config.new_user) {
                    setInputEnabled(false);
                }
                setMessageColor((config as Config).color);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    function handleSettingsClick() {
        props.setCurrentView("settings");
    }

    return (
        <div id="view">
            <img
                className="icon-settings"
                src={SettingsIcon}
                onClick={handleSettingsClick}
                onContextMenu={(e) => e.preventDefault()}
            />
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
            {showOnboarding && (
                <div className="dialogContainer">
                    <dialog>
                        <h1>Instructions</h1>
                        <p>
                            <strong>
                                <span style={{ color: messageColor }}>
                                    You Are Typing
                                </span>
                            </strong>{" "}
                            lets you chat with yourself as a grounding method
                            when you're having a tough time. Here's how it
                            works:
                        </p>

                        <ol>
                            <li>Vent your feelings</li>
                            <li>Use Control + Enter to switch perspectives</li>
                            <li>Respond to yourself like you would a friend</li>
                        </ol>

                        <button
                            style={{
                                color: messageColor,
                                borderColor: messageColor,
                            }}
                            onClick={() => {
                                setInputEnabled(true);
                                setShowOnboarding(false);
                                invoke("set_new_user_config");
                            }}
                        >
                            Start
                        </button>
                    </dialog>
                </div>
            )}
        </div>
    );
}
