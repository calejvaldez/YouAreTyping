/*
MessageTools.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

This is the component for the tools next to a sent message.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/

import Bookmark from "../../assets/bookmark.svg";
import BookmarkOutline from "../../assets/bookmark-outline.svg";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { get_readable_timestamp } from "./tools";

export default function MessageTools(props: {
    isHovered: boolean;
    timestamp: number;
    isBookmarked: boolean;
    setIsBookmarked: Function;
    messageId: string;
}) {
    const [bookmarkIcon, setBookmarkIcon] = useState(BookmarkOutline);

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

    return (
        <div className={"message-toolbar"}>
            <img
                title={
                    props.isBookmarked
                        ? "Remove bookmark"
                        : "Bookmark this message"
                }
                className={props.isBookmarked ? "bookmarked" : "not-bookmarked"}
                hidden={!props.isHovered}
                src={bookmarkIcon}
                onClick={handleBookmarkClick}
            />
            <p className="message-timestamp" hidden={!props.isHovered}>
                {get_readable_timestamp(props.timestamp, "time")}
            </p>
        </div>
    );
}
