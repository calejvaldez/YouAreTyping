import { useRef, useState } from "react";
import "./App.scss";
import MessageInput from "./components/MessageInput";
import { Messages, Message } from "./components/Messages";

function App() {
    const [switched, setSwitched] = useState(false);
    const [messages, setMessages] = useState([] as Message[]);
    const [messageLimit, setMessageLimit] = useState(50);
    const scrollRef = useRef(null);

    return (
        <div id="view">
            <Messages
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
                scrollRef={scrollRef}
                messageLimit={messageLimit}
                setMessageLimit={setMessageLimit}
            />
            <MessageInput
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
                scrollRef={scrollRef}
            />
        </div>
    );
}

export default App;
