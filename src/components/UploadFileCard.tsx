import { useRef, useState } from "react";
import type { FileUploadProps} from "../types/file.ts";

const MAX_FILE_SIZE_MB = 5;

function UploadFileCard({ onFileSelect, label = "Upload Resume (.pdf)" }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        //checking file type
        if (file.type !== "application/pdf") {
            setError("Only PDF files are allowed.");
            setFileName(null);
            return;
        }

        //checking file size
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            setFileName(null);
            return;
        }

        setError(null);
        setFileName(file.name);
        onFileSelect(file);
    };

    return (
        <div className="flex flex-col space-y-2 text-white">
            <label className="font-semibold">{label}</label>

            <div
                className="bg-gray-800 border border-gray-700 rounded px-4 py-3 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => inputRef.current?.click()}
            >
                {fileName ? (
                    <span className="text-green-400">{fileName}</span>
                ) : (
                    <span className="text-gray-400">Click to select a PDF file</span>
                )}
            </div>

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default UploadFileCard;
