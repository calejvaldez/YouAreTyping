/*
Messages.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Implements the messages' container, as well as the messages themselves.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useEffect } from "react";
import "./Messages.scss";
import { invoke } from "@tauri-apps/api";
import Markdown from "react-markdown";
import { open } from "@tauri-apps/api/shell";

export interface Message {
    id: string;
    content: string;
    timestamp: number;
    author: "self" | "other";
}

function Message(props: {
    id: string;
    content: string;
    timestamp: number;
    author: string;
    messageColor: string;
}) {
    return (
        <div
            id={props.id}
            className={"message_" + props.author}
            style={{
                backgroundColor:
                    props.author === "self" ? props.messageColor : "grey",
            }}
        >
            <Markdown
                components={{
                    a: (props: any) => {
                        return (
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    open(props.href);
                                }}
                                href={props.href}
                            >
                                {props.children}
                            </a>
                        );
                    },
                }}
            >
                {props.content}
            </Markdown>
        </div>
    );
}

export function determine_author(
    author: "self" | "other",
    switched: boolean,
): "self" | "other" {
    if (switched) {
        if (author === "self") {
            return "other";
        } else if (author === "other") {
            return "self";
        }
    }

    return author;
}

export function Messages(props: {
    switched: boolean;
    setSwitched: Function;
    messages: Message[];
    setMessages: Function;
    scrollRef: any;
    messageColor: string;
}) {
    useEffect(() => {
        invoke("get_messages").then((messages) => {
            props.setMessages(
                // sorting by time sent
                (messages as Message[]).sort((a, b) => {
                    return b.timestamp - a.timestamp;
                }),
            );
        });
    }, []);

    return (
        <div id="container_messages">
            <div id="all_messages">
                {props.messages.map((message) => {
                    return (
                        <Message
                            key={message.id}
                            messageColor={props.messageColor}
                            id={message.id}
                            content={message.content}
                            author={determine_author(
                                message.author,
                                props.switched,
                            )}
                            timestamp={message.timestamp}
                        />
                    );
                })}
                <p className="beginning-message">
                    This is the beginning of your conversation.
                </p>
                <p className="beginning-message">Return to send a message.</p>
                <p className="beginning-message">
                    Control+Return to switch perspectives.
                </p>
            </div>
        </div>
    );
}
