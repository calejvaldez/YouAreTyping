import "./Messages.scss";

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
    return (
        <div id="container_messages">
            <p id="beginning-message">
                This is the beginning of your conversation.
            </p>
            <SelfMessage content="I just don't feel so good right now. There's so much going on and so little time." />
            <SelfMessage content="I want a break so bad right now." />
            <SelfMessage content="Things need to change but they won't. It's over." />
            <OtherMessage content="Well, yeah things might not change today. But maybe they will at some point." />
            <OtherMessage content="He was a great friend, but it's time to let go." />
            <SelfMessage content="At some point." />
        </div>
    );
}
