import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common['Authorization'];
        toast.success("Logged out successfully");
        socket?.disconnect();
    };

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.user);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                //   Corrected: Set the token as a default header for all subsequent axios requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; 
                connectSocket(data.user);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = async () => {
        handleLogout();
    };

    const updateProfile = async (body) => {
        try {
            // This axios request now works because the token is in the default headers.
            const { data } = await axios.put(`/api/auth/update-profile`, body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            //  Corrected: Set the token as a default header on every page load
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            axios.get(`/api/auth/check`)
                .then(({ data }) => {
                    if (data.success) {
                        setAuthUser(data.user);
                        setToken(storedToken);
                        connectSocket(data.user);
                    } else {
                        handleLogout();
                    }
                })
                .catch(error => {
                    console.error("Authentication check failed:", error);
                    handleLogout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};