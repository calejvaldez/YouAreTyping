/*
MessagesScrollable.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Provides a scrollable view for Messages.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useEffect, useRef, useState } from "react";
import "./Messages.scss";
import { invoke } from "@tauri-apps/api";
import { Message } from "../../types";
import { determine_author } from "./tools";
import MessageTools from "./MessageTools";
import { MessageSent } from "./MessageSent";

function MessageWithTools(props: {
    id: string;
    content: string;
    timestamp: number;
    author: string;
    messageColor: string;
    bookmarked: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);

    function handleMouseOver() {
        setIsHovered(true);
    }

    function handleMouseLeave() {
        setIsHovered(false);
    }

    return (
        <div
            id={props.id}
            className={"message-container-" + props.author}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
        >
            <MessageSent
                content={props.content}
                messageColor={props.messageColor}
                author={props.author}
            />
            <MessageTools
                isHovered={isHovered}
                timestamp={props.timestamp}
                isBookmarked={isBookmarked}
                setIsBookmarked={setIsBookmarked}
                messageId={props.id}
            />
        </div>
    );
}

export function MessagesScrollable(props: {
    switched: boolean;
    messages: Message[];
    messagesHeight: number;
    setMessages: Function;
    messageColor: string;
}) {
    const loadNewMessagesRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        invoke("get_messages").then((messages) => {
            props.setMessages(messages as Message[]);
        });
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        // Inspired by:
        // https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
        if (props.messages.length >= 50 && loadNewMessagesRef.current) {
            let rect = loadNewMessagesRef.current.getBoundingClientRect();

            if (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <=
                    (e.currentTarget.scrollHeight ||
                        document.documentElement.clientHeight) &&
                rect.right <=
                    (window.innerWidth || document.documentElement.clientWidth)
            ) {
                invoke("get_messages", {
                    limit: props.messages.length + 50,
                }).then((messages) => {
                    props.setMessages(messages);
                });
            }
        }
    };

    return (
        <div id="container_messages">
            <div
                id="all_messages"
                style={{ height: `${props.messagesHeight}vh` }}
                onScroll={handleScroll}
            >
                {props.messages.map((message) => {
                    return (
                        <MessageWithTools
                            key={message.id}
                            messageColor={props.messageColor}
                            id={message.id}
                            content={message.content}
                            author={determine_author(
                                message.author as "self" | "other",
                                props.switched,
                            )}
                            timestamp={message.timestamp}
                            bookmarked={message.bookmarked === 1}
                        />
                    );
                })}
                <div style={{ marginBottom: "25px" }}>
                    <div
                        ref={loadNewMessagesRef}
                        style={{ background: "transparent" }}
                    ></div>
                    <p className="beginning-message">
                        Return to send a message.
                    </p>
                    <p className="beginning-message">
                        Control+Return to switch perspectives.
                    </p>
                    <p className="beginning-message">
                        This is the beginning of your conversation.
                    </p>
                </div>
            </div>
        </div>
    );
}
