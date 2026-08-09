import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [token, setToken] = useState("");

    const url = "http://localhost:4000";

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(
                url + "/api/login",
                { email, password }
            );

            const { token } = response.data;

            localStorage.setItem("token", token);
            setToken(token);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setToken("");
    };

    const contextValue = {
        token,
        loginUser,
        logoutUser,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

StoreContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default StoreContextProvider;