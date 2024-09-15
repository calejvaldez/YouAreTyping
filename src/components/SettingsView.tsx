import { invoke } from "@tauri-apps/api";
import BackIcon from "../assets/arrow-back-circle.svg";
import { open } from "@tauri-apps/api/shell";
import "./SettingsView.scss";
import { useEffect, useState } from "react";
import { Config } from "../types";

function SettingsRowWithColorInput(props: {
    label: string;
    currentColor: string;
    setCurrentColor: Function;
}) {
    return (
        <div className="label-centered">
            <label htmlFor="chosen_color">{props.label}</label>

            <input
                type="color"
                id="chosen_color"
                value={props.currentColor}
                onInput={(e) => {
                    invoke("set_color_config", {
                        color: e.currentTarget.value,
                    });
                    props.setCurrentColor(e.currentTarget.value);
                }}
            ></input>
        </div>
    );
}

export default function SettingsView(props: { setCurrentView: Function }) {
    const [currentSelfColor, setCurrentSelfColor] = useState("#ffffff");

    useEffect(() => {
        invoke("get_config").then((c) => {
            setCurrentSelfColor((c as Config).color);
        });
    }, []);

    function handleBackClick() {
        props.setCurrentView("messages");
    }

    function handleGitHubClick() {
        open("https://github.com/calejvaldez/YouAreTyping/");
    }

    return (
        <div id="view-settings">
            <img
                className="icon-back"
                src={BackIcon}
                onClick={handleBackClick}
            />
            <h2>Settings</h2>

            <div className="group-settings">
                <h3>Colors</h3>

                <SettingsRowWithColorInput
                    label="Your Message Color"
                    currentColor={currentSelfColor}
                    setCurrentColor={setCurrentSelfColor}
                />
            </div>

            <div className="acknowledgements">
                <p className="acknowledgements">
                    This program is free and open-source software.{" "}
                    <a onClick={handleGitHubClick}>View on GitHub</a>.
                </p>
            </div>
        </div>
    );
}
