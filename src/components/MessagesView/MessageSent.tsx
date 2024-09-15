/*
MessageSent.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

This is the component for a sent message.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/

import Markdown from "react-markdown";
import { open } from "@tauri-apps/api/shell";

export function MessageSent(props: {
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
