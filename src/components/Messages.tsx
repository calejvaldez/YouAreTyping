import { useEffect } from "react";
import "./Messages.scss";
import { invoke } from "@tauri-apps/api";
import Markdown from "react-markdown";

export interface Message {
    content: string;
    timestamp: number;
    author: "self" | "other";
}

function Message(props: {
    content: string;
    author: "self" | "other";
    timestamp: number;
}) {
    return (
        <div className={"message_" + props.author}>
            <Markdown>{props.content}</Markdown>
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
}) {
    useEffect(() => {
        invoke("get_messages").then((messages) => {
            props.setMessages(messages);
        });

        if (props.scrollRef.current) {
            props.scrollRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, []);

    return (
        <div id="container_messages">
            <p className="beginning-message">
                This is the beginning of your conversation.
            </p>
            <p className="beginning-message">Return to send a message.</p>
            <p className="beginning-message">
                Control+Return to switch perspectives.
            </p>

            {props.messages.map((message) => {
                return (
                    <Message
                        content={message.content}
                        author={determine_author(
                            message.author,
                            props.switched,
                        )}
                        timestamp={message.timestamp}
                    />
                );
            })}

            <div id="invisible" ref={props.scrollRef}></div>
        </div>
    );
}
