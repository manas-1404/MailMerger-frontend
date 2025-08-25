import {getJwtTokenFromLocalStorage} from "./utils.ts";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const uploadFileToBackend = async (filecontent: string, file: File) => {
    const formData = new FormData();
    formData.append("uploaded_file", file);
    formData.append("filecontent", filecontent);

    try{
        const response = await fetch(`${BASE_URL}/api/storage/upload-file`, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${getJwtTokenFromLocalStorage()}`
            }
        })

        if (!response.ok) {
            console.error("Failed to upload file:", response.statusText);
            throw new Error("File upload failed");
        }

        const responseData = await response.json();

        return responseData.success;

    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }

}