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
import { useEffect, useState } from "react";
import { Config } from "../types";
import { SettingsRow } from "./SettingsView/SettingsRow";
import { SettingsGroup } from "./SettingsView/SettingsGroup";

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
        invoke("export_to", { to_format: "json" }).catch((e) => console.log(e));
    }
    function handleExportCsvClick() {
        invoke("export_to", { to_format: "csv" }).catch((e) => console.log(e));
    }

    function handleImportClick() {
        invoke("import").catch((e) => {
            console.log(e);
        });
    }

    function handleDeleteClick() {
        invoke("delete").catch((e) => {
            console.log(e);
        });
    }

    return (
        <div id="view-settings">
            <img
                className="icon-back"
                src={BackIcon}
                onClick={handleBackClick}
                onContextMenu={(e) => e.preventDefault()}
            />
            <h2>Settings</h2>

            <SettingsGroup
                title="Colors"
                description="Customize your experience!"
            >
                <SettingsRow
                    id="settings-colors-row"
                    label="Your Message Color"
                    currentColor={currentSelfColor}
                    setCurrentColor={setCurrentSelfColor}
                />
            </SettingsGroup>

            <SettingsGroup
                title="Data Management"
                description="CSV for spreadsheets. JSON for backups."
            >
                <div>
                    <SettingsRow
                        id="import-data-json"
                        label="Import your data"
                        buttonLabels={["JSON"]}
                        onClickArray={[handleImportClick]}
                    />
                    <SettingsRow
                        id="import-data-csv"
                        label="Export your data"
                        buttonLabels={["CSV", "JSON"]}
                        onClickArray={[
                            handleExportCsvClick,
                            handleExportJsonClick,
                        ]}
                    />
                </div>
            </SettingsGroup>

            <SettingsGroup
                title="Delete Your Data"
                description="Delete all your messages and start anew. This is an irreversible action."
            >
                <div>
                    <SettingsRow
                        id="delete-data"
                        label="Delete your data"
                        buttonLabels={["Delete"]}
                        onClickArray={[handleDeleteClick]}
                    />
                </div>
            </SettingsGroup>

            <div className="acknowledgements">
                <p>
                    This program is free and open-source software.{" "}
                    <a onClick={handleGitHubClick}>View on GitHub</a>.
                </p>
            </div>
        </div>
    );
}
