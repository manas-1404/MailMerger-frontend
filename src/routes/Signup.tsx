import {useState} from "react";
import {oauthSignup} from "../api/backend.ts";
import type {SignUp} from "../types/signup.ts";
import {userSignUp} from "../api/signup.ts";
import {useNavigate} from "react-router-dom";
import {getPasswordChecks} from "../api/utils.ts";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();

    const passwordChecks = getPasswordChecks(password);
    const isPasswordValid = passwordChecks.every(check => check.isValid);
    const isConfirmPasswordValid = confirmPassword === password;

    const handleSignUp = async () => {
        setSubmitError("");

        if (!name || !email || !password || !confirmPassword) {
            setSubmitError("Please fill in all fields.");
            return;
        }

        if (!isPasswordValid) {
            setSubmitError("Password does not meet all requirements.");
            return;
        }

        if (!isConfirmPasswordValid) {
            setSubmitError("Passwords do not match.");
            return;
        }

        const signUpData: SignUp = { name, email, password };

        try {
            const isSignUpSuccess = await userSignUp(signUpData);
            if (isSignUpSuccess) {
                navigate("/dashboard");
            }
        } catch (err) {
            setSubmitError("Signup failed. Please try again.");
        }
    };

    const handleOauthSignup = () => {
        oauthSignup();
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {submitError && (
                    <p className="text-red-400 mb-4 text-sm text-center">{submitError}</p>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-700 border border-gray-600"
                />

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

                {/* Password requirements list */}
                <div className="mb-4 text-sm">
                    {passwordChecks.map((check, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 ${
                                check.isValid ? "text-green-400" : "text-red-400"
                            }`}
                        >
                            <span>{check.isValid ? "✓" : "✗"}</span>
                            <span>{check.label}</span>
                        </div>
                    ))}
                </div>

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full p-3 mb-2 rounded bg-gray-700 border border-gray-600"
                />
                {!isConfirmPasswordValid && confirmPassword.length > 0 && (
                    <p className="text-red-400 text-sm mb-4">Passwords do not match</p>
                )}

                <button
                    onClick={handleSignUp}
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
