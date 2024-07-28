import { useEffect } from "react";
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
    scrollRef: any;
}) {
    useEffect(() => {
        // fetches messages
        props.setMessages([]);

        if (props.scrollRef.current) {
            props.scrollRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
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
