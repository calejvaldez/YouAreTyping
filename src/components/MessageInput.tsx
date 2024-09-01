import "./MessageInput.scss";
import { Message, determine_author } from "./Messages";
import { invoke } from "@tauri-apps/api/tauri";

export default function MessageInput(props: {
    switched: boolean;
    setSwitched: Function;
    messages: Message[];
    setMessages: Function;
    scrollRef: any;
    setMessageColor: Function;
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
                    } else if (e.ctrlKey && e.key === "e") {
                        invoke("export_messages", { as_format: "csv" });
                    } else if (e.ctrlKey && e.key === "c") {
                        let c = document.getElementById(
                            "color-container",
                        ) as HTMLDivElement;
                        c.hidden = !c.hidden;
                    }
                }}
            ></textarea>
            <div id="color-container" hidden={true}>
                <label htmlFor="chosen_color" id="label_chosen_color">
                    Color:
                </label>
                <input
                    type="color"
                    id="chosen_color"
                    onInput={(e) => {
                        props.setMessageColor(e.currentTarget.value);
                        invoke("set_color_config", {
                            color: e.currentTarget.value,
                        });
                    }}
                ></input>
            </div>
        </div>
    );
}
