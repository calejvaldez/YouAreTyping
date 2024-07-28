import { useState } from "react";
import "./App.scss";
import MessageInput from "./components/MessageInput";
import { Messages, Message } from "./components/Messages";

function App() {
    const [switched, setSwitched] = useState(false);
    const [messages, setMessages] = useState([] as Message[]);

    return (
        <div id="view">
            <Messages
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
            />
            <MessageInput
                switched={switched}
                setSwitched={setSwitched}
                messages={messages}
                setMessages={setMessages}
            />
        </div>
    );
}

export default App;
