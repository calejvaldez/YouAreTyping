/*
App.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

The first thing users see when they start You Are Typing.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { useState } from "react";
import MessageView from "./components/MessagesView";
import SettingsView from "./components/SettingsView";

export default function App() {
    const [currentView, setCurrentView] = useState("messages");

    return currentView === "messages" ? (
        <MessageView setCurrentView={setCurrentView} />
    ) : (
        <SettingsView setCurrentView={setCurrentView} />
    );
}
