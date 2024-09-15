/*
Messages.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Implements the messages' container, as well as the messages themselves.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useEffect, useRef, useState } from "react";
import "./Messages.scss";
import { invoke } from "@tauri-apps/api";
import Markdown from "react-markdown";
import { open } from "@tauri-apps/api/shell";
import Bookmark from "../assets/bookmark.svg";
import BookmarkOutline from "../assets/bookmark-outline.svg";
import EditIcon from "../assets/pencil.svg";
import CancelIcon from "../assets/close-circle-outline.svg";

export interface Message {
    id: string;
    content: string;
    timestamp: number;
    author: "self" | "other";
    bookmarked: 0 | 1;
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

function get_readable_timestamp(
    timestamp: number,
    format: "date" | "time",
): string {
    let d = new Date(timestamp * 1000);

    if (format === "date") {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
    } else {
        let hour_24 = d.getHours();
        let hour_12 = hour_24 > 11 ? hour_24 - 12 : hour_24;
        hour_12 = hour_12 === 0 ? 12 : hour_12;
        let minute_padded =
            d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
        let am_pm = hour_24 > 11 ? "pm" : "am";
        return `${hour_12}:${minute_padded} ${am_pm}`;
    }
}

function Tools(props: {
    isHovered: boolean;
    timestamp: number;
    isBookmarked: boolean;
    isEditing: boolean;
    setIsEditing: Function;
    setIsBookmarked: Function;
    messageId: string;
    messages: Message[];
    setMessages: Function;
    messageCount: number;
}) {
    const [bookmarkIcon, setBookmarkIcon] = useState(BookmarkOutline);
    const [editingIcon, setEditingIcon] = useState(EditIcon);

    useEffect(() => {
        setBookmarkIcon(props.isBookmarked ? Bookmark : BookmarkOutline);
    }, [props.isBookmarked]);

    function handleBookmarkClick() {
        props.setIsBookmarked(!props.isBookmarked);

        invoke("toggle_bookmark_message", {
            id: props.messageId,
            bookmark: !props.isBookmarked,
        }).catch((e) => console.log(e));
    }

    function handleEditClick() {
        props.setIsEditing(!props.isEditing);

        setEditingIcon(!props.isEditing ? CancelIcon : EditIcon);

        if (props.isEditing) {
            invoke("get_messages", { limit: props.messageCount }).then((m) => {
                props.setMessages(m as Message[]);
            });
        } else {
            props.setMessages(
                props.messages.filter((m) => m.id === props.messageId),
            );
        }
    }

    return (
        <div className={"message-toolbar"}>
            <div className="buttons">
                <img
                    title={
                        props.isBookmarked
                            ? "Remove bookmark"
                            : "Bookmark this message"
                    }
                    className={
                        props.isBookmarked ? "bookmarked" : "not-bookmarked"
                    }
                    hidden={!props.isHovered}
                    src={bookmarkIcon}
                    onClick={() => {
                        handleBookmarkClick();
                    }}
                />
                <img
                    title={
                        props.isEditing ? "Cancel edit" : "Edit this message"
                    }
                    className="button"
                    hidden={!props.isHovered}
                    src={editingIcon}
                    onClick={() => {
                        handleEditClick();
                    }}
                />
            </div>
            <p className="message-timestamp" hidden={!props.isHovered}>
                {get_readable_timestamp(props.timestamp, "date") +
                    " at " +
                    get_readable_timestamp(props.timestamp, "time")}
            </p>
        </div>
    );
}

function Message(props: {
    author: string;
    messageColor: string;
    content: string;
}) {
    return (
        <div
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

function MessageContainer(props: {
    id: string;
    content: string;
    timestamp: number;
    author: string;
    messageColor: string;
    bookmarked: boolean;
    isEditing: boolean;
    setIsEditing: Function;
    messages: Message[];
    setMessages: Function;
    messageCount: number;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);

    return (
        <div
            id={props.id}
            className={"message-container-" + props.author}
            onMouseOver={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Message
                content={props.content}
                messageColor={props.messageColor}
                author={props.author}
            />
            <Tools
                isHovered={isHovered}
                timestamp={props.timestamp}
                isBookmarked={isBookmarked}
                setIsBookmarked={setIsBookmarked}
                isEditing={props.isEditing}
                setIsEditing={props.setIsEditing}
                messageId={props.id}
                messages={props.messages}
                setMessages={props.setMessages}
                messageCount={props.messageCount}
            />
        </div>
    );
}

export function Messages(props: {
    switched: boolean;
    messages: Message[];
    messagesHeight: number;
    setMessages: Function;
    messageColor: string;
    isEditing: boolean;
    setIsEditing: Function;
    messageCount: number;
    setMessageCount: Function;
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
                    props.setMessageCount(props.messages.length + 50);
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
                        <MessageContainer
                            key={message.id}
                            messageColor={props.messageColor}
                            id={message.id}
                            content={message.content}
                            author={determine_author(
                                message.author,
                                props.switched,
                            )}
                            timestamp={message.timestamp}
                            bookmarked={message.bookmarked === 1}
                            isEditing={props.isEditing}
                            setIsEditing={props.setIsEditing}
                            messages={props.messages}
                            setMessages={props.setMessages}
                            messageCount={props.messageCount}
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
