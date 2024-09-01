/*
main.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

Starts the frontend.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.en.html
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
