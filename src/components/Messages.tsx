import { useEffect, useState } from "react";
import "./Messages.scss";

interface Message {
    content: string;
    timestamp: number;
    sender: "self" | "other";
}

function SelfMessage(props: { content: string; timestamp?: number }) {
    return (
        <div className="message_self">
            <p>{props.content}</p>
        </div>
    );
}

function OtherMessage(props: { content: string; timestamp?: number }) {
    return (
        <div className="message_other">
            <p>{props.content}</p>
        </div>
    );
}

export default function Messages() {
    const [messages, setMessages] = useState([] as Message[]);

    useEffect(() => {
        // fetches messages
        setMessages([
            {
                content:
                    "I just don't feel so good right now. There's so much going on and so little time.",
                sender: "self",
                timestamp: 0,
            },
            {
                content: "I want a break so bad right now.",
                sender: "self",
                timestamp: 1,
            },
            {
                content: "Things need to change but they won't. It's over.",
                sender: "self",
                timestamp: 2,
            },
            {
                content:
                    "Well, yeah things might not change today. But maybe they will at some point.",
                sender: "other",
                timestamp: 3,
            },
            {
                content: "He was a great friend, but it's time to let go.",
                sender: "other",
                timestamp: 4,
            },
            {
                content: "At some point.",
                sender: "self",
                timestamp: 5,
            },
        ]);
    }, []);

    return (
        <div id="container_messages">
            <p id="beginning-message">
                This is the beginning of your conversation.
            </p>

            {messages.map((message) => {
                if (message.sender === "self") {
                    return <SelfMessage content={message.content} />;
                } else {
                    return <OtherMessage content={message.content} />;
                }
            })}
        </div>
    );
}
