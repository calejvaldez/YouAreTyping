/*
SettingsView.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

View the Settings page.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import { invoke } from "@tauri-apps/api";
import BackIcon from "../assets/arrow-back-circle.svg";
import { open } from "@tauri-apps/api/shell";
import "./SettingsView.scss";
import { MouseEventHandler, useEffect, useState } from "react";
import { Config } from "../types";
import { emit } from "@tauri-apps/api/event";

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

function SettingsRowWithButtons(props: {
    row_label: string;
    button_labels: string[];
    onClickArray: Function[];
}) {
    return (
        <div className="label-centered">
            <label>{props.row_label}</label>

            <div>
                {props.button_labels.map((label, index) => {
                    return (
                        <button
                            key={props.row_label
                                .replace(" ", "_")
                                .toLowerCase()}
                            className="button-settings"
                            onClick={
                                props.onClickArray[
                                    index
                                ] as MouseEventHandler<HTMLButtonElement>
                            }
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
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

    function handleExportJsonClick() {
        emit("tauri://menu", "export_json");
    }
    function handleExportCsvClick() {}

    function handleImportClick() {}

    return (
        <div id="view-settings">
            <img
                className="icon-back"
                src={BackIcon}
                onClick={handleBackClick}
                onContextMenu={(e) => e.preventDefault()}
            />
            <h2>Settings</h2>

            <div className="group-settings">
                <h3>Colors</h3>
                <p>Customize your experience!</p>

                <SettingsRowWithColorInput
                    label="Your Message Color"
                    currentColor={currentSelfColor}
                    setCurrentColor={setCurrentSelfColor}
                />
            </div>

            <div className="group-settings">
                <h3>Data Management</h3>

                <p>
                    CSV for spreadsheets.
                    <br />
                    JSON for backups.
                </p>

                <div>
                    <SettingsRowWithButtons
                        row_label="Import your data"
                        button_labels={["JSON"]}
                        onClickArray={[handleImportClick]}
                    />
                    <SettingsRowWithButtons
                        row_label="Export your data"
                        button_labels={["CSV", "JSON"]}
                        onClickArray={[
                            handleExportCsvClick,
                            handleExportJsonClick,
                        ]}
                    />
                </div>
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
