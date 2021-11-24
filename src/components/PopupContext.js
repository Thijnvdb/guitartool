import { useState, createContext } from "react"
import Popup from "./Popup";

export const PopupContext = createContext();
export const PopupProvider = ({children}) => {
    const [popup, setPopup] = useState();

    function createPopup(contents, style = {}) {
        setPopup(<Popup style={style}>{contents}</Popup>);
    }

    function closePopup() {
        setPopup();
    }

    return <PopupContext.Provider value={{
        closePopup:closePopup,
        createPopup:createPopup,
        popup:popup    
    }}>
        {children}
    </PopupContext.Provider>
}