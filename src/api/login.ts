import type {LoginData} from "../types/login.ts";
import {setLocalStorageTokens} from "./utils.ts";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const loginUser = async (loginDetails: LoginData) => {

    try{
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginDetails)
        })

        if (!response.ok) {
            console.error("Failed to log in:", response.statusText);
            throw new Error("Login failed");
        }

        const responseData = await response.json();

        setLocalStorageTokens("jwt_token", responseData.data.jwt_token);

        return responseData.data.user_name;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}