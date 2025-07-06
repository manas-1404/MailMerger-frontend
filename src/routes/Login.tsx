import { useState } from "react";
import {oauthLogin} from "../api/backend.ts";



export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleOauthLogin = () => {
        console.log("OAuth login initiated");

        oauthLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={() => console.log("Login with:", email, password)}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold"
                >
                    Log In
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
