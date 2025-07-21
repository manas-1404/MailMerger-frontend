import { useState } from "react";
import UploadFileCard from "../components/UploadFileCard.tsx";
import {uploadFileToBackend} from "../api/uploadfile.ts";

function UploadFilePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!selectedFile) {
            return;
        }

        setUploading(true);
        setSuccessMessage(null);


        const upload_success = await uploadFileToBackend("resume", selectedFile);

        setUploading(false);

        if (upload_success) {
            setSuccessMessage("File uploaded successfully!");
            setSelectedFile(null);
        } else{
            setSuccessMessage("Failed to upload file. Please try again.");
        }

    };

    return (
        <div className="min-h-screen bg-black text-white p-8 space-y-6">
            <h2 className="text-3xl font-bold">Upload Resume</h2>

            <UploadFileCard onFileSelect={setSelectedFile} />

            <button
                disabled={!selectedFile || uploading}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded disabled:opacity-50"
                onClick={handleUpload}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {successMessage && <div className="text-green-400">{successMessage}</div>}
        </div>
    );
}

export default UploadFilePage;
