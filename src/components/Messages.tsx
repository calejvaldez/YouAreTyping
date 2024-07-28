import { useEffect, useState } from "react";
import "./Messages.scss";

export interface Message {
    content: string;
    timestamp: number;
    author: "self" | "other";
}

function Message(props: {
    content: string;
    author: "self" | "other";
    timestamp?: number;
}) {
    return (
        <div className={"message_" + props.author}>
            <p>{props.content}</p>
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
}) {
    useEffect(() => {
        // fetches messages
        props.setMessages([
            {
                content:
                    "I just don't feel so good right now. There's so much going on and so little time.",
                author: "self",
                timestamp: 0,
            },
            {
                content: "I want a break so bad right now.",
                author: "self",
                timestamp: 1,
            },
            {
                content: "Things need to change but they won't. It's over.",
                author: "self",
                timestamp: 2,
            },
            {
                content:
                    "Well, yeah things might not change today. But maybe they will at some point.",
                author: "other",
                timestamp: 3,
            },
            {
                content: "He was a great friend, but it's time to let go.",
                author: "other",
                timestamp: 4,
            },
            {
                content: "At some point.",
                author: "self",
                timestamp: 5,
            },
        ]);
    }, []);

    return (
        <div id="container_messages">
            <p id="beginning-message">
                This is the beginning of your conversation.
            </p>

            {props.messages.map((message) => {
                return (
                    <Message
                        content={message.content}
                        author={determine_author(
                            message.author,
                            props.switched,
                        )}
                    />
                );
            })}
        </div>
    );
}
