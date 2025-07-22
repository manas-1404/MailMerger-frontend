import type {SignUp} from "../types/signup.ts";
import {setLocalStorageTokens} from "./utils.ts";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const userSignUp = async (userData: SignUp) => {

    try {
        const response = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })

        if (!response.ok) {
            console.error("Failed to sign up:", response.statusText);
            throw new Error("Sign up failed");
        }

        const responseData = await response.json();

        setLocalStorageTokens("jwt_token" , responseData.data.jwt_token)
        setLocalStorageTokens("refresh_token", responseData.data.refresh_token);

        return true;

    } catch (error) {
        console.error("Error during sign up:", error);
        throw error;
    }
}