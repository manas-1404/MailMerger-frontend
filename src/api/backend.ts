import type {Email} from "../types/email.ts";
import {getJwtTokenFromLocalStorage} from "./utils.ts";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const oauthSignup = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/gmail-authorize?purpose=signup`;
};

export const oauthLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/gmail-authorize?purpose=authorize`;
}

export const getNewJwtTokens = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/refresh-jwt-token`, {
        credentials: "include",
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to refresh JWT token");
    }

    const responseData = await response.json();

    const jwtToken = responseData.data.jwt_token;

    localStorage.setItem("jwt_token", jwtToken);

    console.log("jwt token is: ", jwtToken);

    return jwtToken;
}

export const sendEmailNow = async (email: Email) => {
    try {
        const response = await fetch(`${BASE_URL}/api/email/send-email-now`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`,
            },
            body: JSON.stringify(email),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export const addToEmailQueue = async (email: Email) => {
    try {
        const response = await fetch(`${BASE_URL}/api/queue/add-to-queue`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`,
            },
            body: JSON.stringify(email),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}