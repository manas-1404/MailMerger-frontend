import type {Email} from "../types/email.ts";
import {getJwtTokenFromLocalStorage, getRefreshTokenFromLocalStorage} from "./utils.ts";
import type {ListOfTemplates, Template} from "../types/template.ts";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const oauthSignup = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/gmail-authorize?purpose=signup`;
};

export const oauthLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/gmail-authorize?purpose=authorize`;
}

export const getNewJwtTokens = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/refresh-jwt-token`, {
        // credentials: "include",
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getRefreshTokenFromLocalStorage()}`
        }
    });

    console.log("Refresh token is: ", getRefreshTokenFromLocalStorage());

    if (!response.ok) {
        console.log(response);
        throw new Error("Failed to refresh JWT token");
    }

    const responseData = await response.json();

    const jwtToken = responseData.data.jwt_token;

    localStorage.setItem("jwt_token", jwtToken);

    console.log("jwt token is: ", jwtToken);

    return jwtToken;
}


export const getNewRefreshAndJWTokens = async () => {
    const response = await fetch(`${BASE_URL}/api/auth/renew-refresh-and-jwt-token`, {
        // credentials: "include",
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getRefreshTokenFromLocalStorage()}`
        }
    });

    console.log("Expired Refresh token is: ", getRefreshTokenFromLocalStorage());

    if (!response.ok) {
        console.log(response);
        throw new Error("Failed to refresh JWT token");
    }

    const responseData = await response.json();

    const jwtToken = responseData.data.jwt_token;
    const refreshToken = responseData.data.refresh_token;

    localStorage.setItem("jwt_token", jwtToken);
    localStorage.setItem("refresh_token", refreshToken);

    console.log("jwt token is: ", jwtToken);
    console.log("new refresh token is: ", refreshToken);

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
            throw new Error("Failed to add email to queue");
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error("Error adding email to queue:", error);
        throw error;
    }
}

export const getEmailTemplates = async () => {
    try{
        const response = await fetch(`${BASE_URL}/api/templates/get-all-templates`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`
            }
        }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch email templates");
        }

        const responseData = await response.json();

        const templatesList: ListOfTemplates = {templates: responseData.data.templates};

        return templatesList;
    } catch (error) {
        console.error("Error fetching email templates:", error);
        throw error;
    }
}

export const saveEmailTemplate = async (templateObject: Template) => {
    try{
        const response = await fetch(`${BASE_URL}/api/templates/add-template`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`
            },
            body: JSON.stringify(templateObject),
        });

        if (!response.ok) {
            throw new Error("Failed to save email template");
        }

        const responseData = await response.json();

        return responseData.data;

    } catch (error) {
        console.log("Error saving email template:", error);
        throw error;
    }
}

export const updateEmailTemplate = async (templateObject: Template) => {
    try{
        const response = await fetch(`${BASE_URL}/api/templates/update-template`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`
            },
            body: JSON.stringify(templateObject),
        });

        if (!response.ok) {
            throw new Error("Failed to save email template");
        }

        const responseData = await response.json();

        const updatedTemplateId: number = responseData.data.template_id;

        return updatedTemplateId;

    } catch (error) {
        console.log("Error saving email template:", error);
        throw error;
    }
}

export const deleteEmailTemplates = async (templateIdList: number[]) => {
    try{
        const response = await fetch(`${BASE_URL}/api/templates/delete-template`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`,
                    "Content-Type": "application/json"
                },
            body: JSON.stringify(templateIdList)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete email template");
        }

        const responseData = await response.json();

        const deletedTemplatesList: number[] = responseData.data.template_ids;

        return deletedTemplatesList;

    } catch (error) {
        console.error("Error fetching email templates:", error);
        throw error;
    }
}

export const sendQueuedEmails = async (email_ids: number[]) => {
    try {

        console.log("Sending queued emails with IDs:", email_ids);
        const response = await fetch(`${BASE_URL}/api/queue/send-queued-emails`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(email_ids),
        });

        if (!response.ok) {
            throw new Error("Failed to send queued emails");
        }

        const responseData = await response.json();

        const emails: Email[] = responseData.data.emails;

        return emails;
    } catch (error) {
        console.error("Error sending queued emails:", error);
        throw error;
    }
};

export const getQueuedEmails = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/queue/get-email-queue`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch queued emails");
        }

        const responseData = await response.json();

        const emails: Email[] = responseData.data.emails;

        return emails;
    } catch (error) {
        console.error("Error fetching queued emails:", error);
        throw error;
    }
};

export const deleteQueuedEmails = async (emailIdList: number[]) => {
    try {
        const response = await fetch(`${BASE_URL}/api/queue/delete-queue-email`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailIdList)
        });

        if (!response.ok) {
            throw new Error("Failed to delete queued emails");
        }

        const responseData = await response.json();

        return responseData.data.deleted_emails_ids;
    } catch (error) {
        console.error("Error fetching queued emails:", error);
        throw error;
    }
};