import { createContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(() => Number(localStorage.getItem('credits')) || 5);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    console.log("Backend URL:", backendUrl);

    // ✅ Load user credits from the backend
    const loadCreditsData = useCallback(async () => {
        if (!token) return; // Don't fetch if there's no user logged in

        try {
            const { data } = await axios.get(`${backendUrl}/api/users/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                const updatedCredits = data.credits ?? 5; // Ensure credits are set properly
                setCredit(updatedCredits);
                localStorage.setItem('credits', updatedCredits);
                setUser(data.user);
                console.log("✅ Credits updated:", updatedCredits);
            } else {
                console.warn("⚠️ Credits API returned failure:", data);
            }
        } catch (error) {
            console.error("❌ Error loading credits:", error.response?.data || error.message);
            if (token) {
                toast.error(error.response?.data?.message || "An error occurred.");
            }
        }
    }, [token, backendUrl]);

    // ✅ Ensure credits are fetched when token changes
    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token]);

    const handleSignIn = async (userData) => {
        try {
            setUser(userData);
            setToken(userData.token);
            localStorage.setItem("token", userData.token);

            console.log("✅ User logged in:", userData);

            // ✅ Fetch credits from backend instead of assuming default value
            await loadCreditsData();

            if (userData.isNewUser) {
                toast.success("🎉 Welcome! Your account has been created.", { autoClose: 3000 });
            } else {
                toast.success("👋 Welcome back!", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("❌ Error signing in:", error);
            toast.error("Login failed. Please try again.");
        }
    };

    const generateImage = async (prompt) => {
        // ✅ Ensure credits are up-to-date before allowing image generation
        await loadCreditsData();

        if (credit <= 0) {
            toast.warn("You have no credits left! Redirecting to buy page...", { autoClose: 3000 });
            setTimeout(() => navigate("/buy"), 2000);
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                { prompt },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                const newCredit = credit - 1;
                setCredit(newCredit);
                localStorage.setItem("credits", newCredit);
                
                console.log("✅ Image generated, new credits:", newCredit);
                toast.success(`Image generated successfully! Credits left: ${newCredit}`, { autoClose: 2000 });

                return data.resultImage;
            } else {
                toast.error(data.message);
                if (data.creditBalance === 0) {
                    toast.warn("You have no credits left! Redirecting to buy page...", { autoClose: 3000 });
                    setTimeout(() => navigate("/buy"), 2000);
                }
            }
        } catch (error) {
            console.error("❌ Error generating image:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    // ✅ Logout Function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('credits');
        setToken(null);
        setUser(null);
        setCredit(5);

        toast.info("Logged out. Credits reset to 5.", { autoClose: 2000 });
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage,
        handleSignIn,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
