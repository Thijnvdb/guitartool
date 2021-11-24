import React , { useContext } from "react";
import "../stylesheets/popup.scss"
import { PopupContext } from "./PopupContext";

export default function Popup({children}) {
    const popupContext = useContext(PopupContext);

    return (
        <div className="popup">
            <div className="contents">
                {children}
            </div>
            <div className="backdrop" onClick={popupContext.closePopup}></div>
        </div>
    )
}