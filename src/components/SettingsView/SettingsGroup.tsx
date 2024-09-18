/*
SettingsGroup.tsx
Part of the You Are Typing project.
https://github.com/calejvaldez/YouAreTyping/

A group of settings with a title, description, and rows.

Licensed under the GNU GPLv3 license.
https://www.gnu.org/licenses/gpl-3.0.html
*/
import "./SettingsGroup.scss";

export function SettingsGroup(props: {
    title: string;
    description: string;
    children: any;
}) {
    return (
        <div className="settings-group">
            <h3>{props.title}</h3>
            <p>{props.description}</p>

            {props.children}
        </div>
    );
}
