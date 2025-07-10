import { useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {isJwtExpired} from "../api/utils.ts";
import {getNewJwtTokens} from "../api/backend.ts";

function Dashboard(){
    const navigate = useNavigate();

    const checkAndRefreshToken = async () => {
        const token = localStorage.getItem("jwt_token");

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
                <h1 className="text-3xl font-bold text-white mb-2">Hello, Username</h1>
                <h2 className="text-white text-xl mb-8">Welcome to your email dashboard.</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-20">
                    <button onClick={() => navigate('/quick-email')}>📨 Send Quick Email</button>
                    <button onClick={() => navigate('/write-email')}>📝 Write Email</button>
                    <button onClick={() => navigate('/send-queue')}>📦 Send Email Queue</button>
                    <button onClick={() => navigate('/make-template')}>📂 Create Email Template</button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;