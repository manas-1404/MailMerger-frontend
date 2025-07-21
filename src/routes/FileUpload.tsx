import { useState } from "react";
import { uploadFileToBackend } from "../api/uploadfile.ts";

function UploadFilePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
            setSelectedFile(file);
            setUploadStatus(null);
            setMessage(null);
        } else {
            setSelectedFile(null);
            setUploadStatus("error");
            setMessage("Invalid file. Please upload a PDF under 5MB.");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setMessage(null);
        setUploadStatus(null);

        const success = await uploadFileToBackend("resume", selectedFile);

        setUploading(false);

        if (success) {
            setUploadStatus("success");
            setMessage("File uploaded successfully.");
            setSelectedFile(null);
        } else {
            setUploadStatus("error");
            setMessage("Failed to upload file. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen text-white">
            <div className="flex h-[90%] overflow-hidden">

                {/*left side upload side */}
                <div className="flex flex-col w-[43%] p-6 space-y-6 overflow-y-auto border-r border-gray-700">
                    <h2 className="text-3xl font-bold">Upload Resume</h2>

                    <div className="text-left space-y-2 ml-3">
                        <p className="text-xl font-semibold">Upload Guidelines:</p>
                        <ul className="list-disc list-inside text-gray-300 text-base space-y-1">
                            <li>Only PDF files are allowed</li>
                            <li>Maximum file size: 5MB</li>
                        </ul>
                    </div>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="bg-gray-800 text-sm p-2 rounded-md file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2"
                    />

                    <button
                        disabled={!selectedFile || uploading}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded disabled:opacity-50"
                        onClick={handleUpload}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>

                    {message && (
                        <div className={`text-sm font-medium ${uploadStatus === "success" ? "text-green-400" : "text-red-400"}`}>
                            {message}
                        </div>
                    )}
                </div>

                {/*ighrt side file preview side */}
                <div className="w-[57%] p-6 flex flex-col">
                    <p className="text-2xl font-semibold mb-4">Preview</p>
                    {selectedFile ? (
                        <embed
                            src={URL.createObjectURL(selectedFile)}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            className="flex-1 rounded-md border border-gray-700"
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 italic border border-dashed border-gray-600 rounded-md">
                            Upload a file to preview it.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UploadFilePage;
