import "./App.scss";
import MessageInput from "./components/MessageInput";
import Messages from "./components/Messages";

function App() {
    return (
        <div id="view">
            <Messages />
            <MessageInput />
        </div>
    );
}

export default App;
