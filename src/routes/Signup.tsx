import { useState } from "react";
import { oauthSignup } from "../api/backend.ts";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleOauthSignup = () => {
        console.log("OAuth signup initiated");
        oauthSignup();
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

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
                    onClick={() => console.log("Signup with:", name, email, password)}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-semibold"
                >
                    Sign Up
                </button>

                <div className="my-6 text-center border-t border-gray-600 pt-4 text-gray-400">
                    OR
                </div>

                <button
                    onClick={handleOauthSignup}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold"
                >
                    Sign up with Google
                </button>
            </div>
        </div>
    );
}
