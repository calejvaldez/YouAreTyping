/*
SettingsRow.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

A row in the settings page.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/

import { invoke } from "@tauri-apps/api";
import { MouseEventHandler } from "react";
import "./SettingsRow.scss";

export function SettingsRow(props: {
    id: string;
    label: string;
    currentColor?: string;
    setCurrentColor?: Function;
    buttonLabels?: string[];
    onClickArray?: Function[];
}) {
    return (
        <div className="settings-row">
            <label>{props.label}</label>
            {props.currentColor ? (
                // If `props.currentColor` is set, that means this is a row for
                // color input. Therefore, return the appropriate code.
                <input
                    type="color"
                    id={props.id}
                    value={props.currentColor}
                    onInput={(e) => {
                        invoke("set_color_config", {
                            color: e.currentTarget.value,
                        });
                        props.setCurrentColor!(e.currentTarget.value);
                    }}
                ></input>
            ) : (
                // If `props.currentColor` is not set, it's instead a row with
                // buttons.
                <div>
                    {props.buttonLabels?.map((label, index) => {
                        return (
                            <button
                                key={props.id + `${index}`}
                                className="settings-button"
                                onClick={
                                    props.onClickArray![
                                        index
                                    ] as MouseEventHandler<HTMLButtonElement>
                                }
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
