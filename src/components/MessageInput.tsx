import "./MessageInput.scss";

export default function MessageInput(props: {
    switched: boolean;
    setSwitched: Function;
}) {
    return (
        <div id="container_message_input">
            <textarea
                id="message_text_input"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                        props.setSwitched(props.switched ? false : true);
                    } else if (e.key === "Enter" && !e.metaKey) {
                        // send message
                    }
                }}
            ></textarea>
        </div>
    );
}
