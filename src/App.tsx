import { useState } from "react";
import "./App.scss";
import MessageInput from "./components/MessageInput";
import Messages from "./components/Messages";

function App() {
    const [switched, setSwitched] = useState(false);

    return (
        <div id="view">
            <Messages switched={switched} setSwitched={setSwitched} />
            <MessageInput switched={switched} setSwitched={setSwitched} />
        </div>
    );
}

export default App;
