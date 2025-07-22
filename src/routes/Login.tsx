import { useState } from "react";
import { oauthLogin } from "../api/backend.ts";
import { loginUser } from "../api/login.ts";
import type { LoginData } from "../types/login.ts";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isFormValid = email.trim() !== "" && password.trim() !== "";

    const handleOauthLogin = () => {
        oauthLogin();
    };

    const handleLogin = async () => {
        setError("");

        if (!isFormValid) {
            setError("Please fill in both email and password.");
            return;
        }

        setLoading(true);

        const loginDetails: LoginData = { email, password };

        try {
            const userName = await loginUser(loginDetails);
            console.log("Logged in as:", userName);
            navigate("/dashboard", { state: { username: userName}});
        } catch {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {error && (
                    <p className="text-red-400 mb-4 text-sm text-center">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 mb-2 rounded bg-gray-700 border border-gray-600"
                />

                {/*{!isFormValid && (*/}
                {/*    <p className="text-red-400 text-sm mb-3 text-center">*/}
                {/*        Please fill in both email and password.*/}
                {/*    </p>*/}
                {/*)}*/}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className={`w-full py-3 rounded font-semibold transition ${
                        loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>

                <div className="my-6 text-center border-t border-gray-600 pt-4 text-gray-400">
                    OR
                </div>

                <button
                    onClick={handleOauthLogin}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
