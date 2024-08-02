import { useEffect, useState } from "react";
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

function Message(props: Message) {
    const [hovered, setHovered] = useState("");

    return (
        <div
            className={"message_container_" + props.author}
            onMouseOver={() => {
                setHovered(props.id);
            }}
            onMouseLeave={() => {
                setHovered("");
            }}
            id={props.id}
        >
            <div className={"message_" + props.author}>
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
            <button
                hidden={hovered !== props.id}
                onClick={() => {
                    props.content = "";
                }}
            >
                Reply
            </button>
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
    messageLimit: number;
    setMessageLimit: Function;
}) {
    useEffect(() => {
        invoke("get_messages", { limit: props.messageLimit }).then(
            (messages) => {
                props.setMessages(messages);
            },
        );
    }, []);

    // todo: detect when the top of the `all_messages` div has been reached
    // todo: when it's been reached, run setMessageLimit(messageLimit+50)
    // todo: create a handleMessageLimitChange function to set the limit and
    // todo: ... invoke Tauri's backend

    return (
        <div id="container_messages">
            <div id="all_messages">
                {props.messages.map((message) => {
                    return (
                        <Message
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
