import { useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {isJwtExpired, isRefreshTokenExpired, setLocalStorageTokens} from "../api/utils.ts";
import {getNewJwtTokens, getNewRefreshAndJWTokens} from "../api/backend.ts";

function Dashboard(){
    const navigate = useNavigate();
    const userNameFromLogin = useLocation().state?.username || "";
    const [userName, setUserName] = useState<string>(localStorage.getItem("username") || "Username");

    useEffect(() => {

        if(userNameFromLogin){
            setUserName(userNameFromLogin);
            setLocalStorageTokens("username", userNameFromLogin);
        }
    }, [userNameFromLogin]);

    const checkAndRefreshToken = async () => {
        const token = localStorage.getItem("jwt_token");
        const refresh_token = localStorage.getItem("refresh_token");

        if (!refresh_token || isRefreshTokenExpired(refresh_token)){
            try {
                const userName: string = await getNewRefreshAndJWTokens()
                setUserName(userName);
                setLocalStorageTokens("username", userName);
            } catch (error) {
                console.error("Failed to refresh tokens:", error);
                console.log(error);
                navigate("/login");
            }
        }

        if (!token || isJwtExpired(token)) {
            try {
                await getNewJwtTokens();
                console.log("JWT token refreshed successfully.");
            } catch (error) {
                console.error("Failed to refresh JWT token:", error);
                console.log(error);
                navigate("/login");
            }
        }
    };

    useEffect(() => {

        checkAndRefreshToken();
    }, []);


    return (
        <div >
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Hello, {userName}</h1>
                <h2 className="text-white text-xl mb-8">Welcome to your email dashboard.</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
                    <button onClick={() => navigate('/write-email')}>Write Email</button>
                    <button onClick={() => navigate('/manage-email-queue')}>Send Email Queue</button>
                    <button onClick={() => navigate('/make-template')}>Create Email Template</button>
                    <button onClick={() => navigate('/manage-templates')}>Manage Email Templates</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;