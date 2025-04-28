import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <StoreContext.Provider value={{ email, setEmail, password, setPassword }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStoreContext = () => {
    return useContext(StoreContext);
};
