import "./MessageInput.scss";
import { Message, determine_author } from "./Messages";

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
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                        props.setSwitched(props.switched ? false : true);
                    } else if (e.key === "Enter" && !e.metaKey) {
                        e.preventDefault();
                        if (e.currentTarget.value === "") {
                            return;
                        }
                        props.setMessages(
                            props.messages.concat([
                                {
                                    author: determine_author(
                                        "self",
                                        props.switched,
                                    ), // todo: check to see if this works appropriately
                                    content: e.currentTarget.value,
                                    timestamp: new Date().getUTCSeconds(),
                                },
                            ]),
                        );

                        e.currentTarget.value = "";
                        props.scrollRef.current.scrollIntoView({
                            behavior: "smooth",
                            block: "end",
                        });
                    }
                }}
            ></textarea>
        </div>
    );
}
