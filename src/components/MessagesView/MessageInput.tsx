/*
MessageInput.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

The bottom part of the program where the input box is.
The idea is that this would include the textbox, and other buttons.
For now, it's just the input box.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import "./MessageInput.scss";
import { determine_author } from "./tools";
import { invoke } from "@tauri-apps/api/tauri";
import TextareaAutosize from "react-textarea-autosize";
import { Message } from "../../types";

export default function MessageInput(props: {
    switched: boolean;
    setSwitched: Function;
    messages: Message[];
    setMessages: Function;
    setMessageColor: Function;
    messagesHeight: number;
    setMessagesHeight: Function;
    inputEnabled: boolean;
}) {
    return (
        <div id="container_message_input">
            <TextareaAutosize
                id="message_text_input"
                autoComplete="off"
                placeholder={
                    props.inputEnabled
                        ? "Start typing here!"
                        : "You cannot send a message in Search mode."
                }
                disabled={!props.inputEnabled}
                maxRows={10}
                onHeightChange={(height) => {
                    let height_change = (height / 17) * 3;
                    props.setMessagesHeight(93 - height_change);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        props.setSwitched(props.switched ? false : true);
                    } else if (e.key === "Enter" && !e.shiftKey) {
                        let timestamp = Math.floor(new Date().getTime() / 1000);
                        e.preventDefault();
                        if (e.currentTarget.value === "") {
                            return;
                        }
                        invoke("save_message", {
                            content: e.currentTarget.value,
                            author: determine_author("self", props.switched),
                            timestamp: timestamp,
                        }).then((m) => {
                            props.setMessages(
                                (m as Message[]).concat(props.messages),
                            );
                        });

                        e.currentTarget.value = "";
                    } else if (e.ctrlKey && e.key === "c") {
                        let c = document.getElementById(
                            "color-container",
                        ) as HTMLDivElement;
                        c.hidden = !c.hidden;
                    }
                }}
            />
        </div>
    );
}
