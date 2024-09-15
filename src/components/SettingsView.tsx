import BackIcon from "../assets/arrow-back-circle.svg";
import "./SettingsView.scss";

export default function SettingsView(props: { setCurrentView: Function }) {
    function handleBackClick() {
        props.setCurrentView("messages");
    }

    return (
        <div>
            <img
                className="icon-back"
                src={BackIcon}
                onClick={handleBackClick}
            />
        </div>
    );
}
