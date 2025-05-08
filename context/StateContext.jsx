"use client";
import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export default function StateProvider({children}) {
    const [isOpen, setIsOpen] = useState(false);

    const ToggleOpen = () => {
        setIsOpen((prevSet) => (prevSet === false ? true : false));
    }

    return(
        <StateContext.Provider value={{isOpen, ToggleOpen}}>
            {children}
        </StateContext.Provider>
    )
}

export function UseStateContext() {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}