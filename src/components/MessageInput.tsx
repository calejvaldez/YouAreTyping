import "./MessageInput.scss";
import { Message, determine_author } from "./Messages";
import { invoke } from "@tauri-apps/api/tauri";

export default function MessageInput(props: {
    switched: boolean;
    setSwitched: Function;
    messages: Message[];
    setMessages: Function;
    scrollRef: any;
}) {
    return (
        <div id="container_message_input">
            <textarea
                id="message_text_input"
                placeholder="Start typing here!"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        props.setSwitched(props.switched ? false : true);
                    } else if (e.key === "Enter" && !e.shiftKey) {
                        let timestamp = Math.floor(new Date().getTime() / 1000);
                        e.preventDefault();
                        if (e.currentTarget.value === "") {
                            return;
                        }
                        props.setMessages(
                            [
                                {
                                    author: determine_author(
                                        "self",
                                        props.switched,
                                    ), // todo: check to see if this works appropriately
                                    content: e.currentTarget.value,
                                    timestamp: timestamp,
                                },
                            ].concat(props.messages),
                        );

                        invoke("save_message", {
                            content: e.currentTarget.value,
                            author: determine_author("self", props.switched),
                            timestamp: timestamp,
                        });

                        e.currentTarget.value = "";
                    }
                }}
            ></textarea>
        </div>
    );
}
