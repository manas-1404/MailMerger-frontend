import {useState, useEffect, type ChangeEvent} from "react";

import type {Template} from "../types/template.ts";
import {saveEmailTemplate} from "../api/backend.ts";

export default function MakeTemplate() {
    const [body, setBody] = useState("");
    const [templateKeys, setTemplateKeys] = useState<string[]>([]);

    useEffect(() => {
        const matches = body.match(/{{\s*([\w_]+)\s*}}/g) || [];
        const keys: string[] = matches.map(m => m.replace(/{{\s*|\s*}}/g, ""));
        setTemplateKeys([...new Set(keys)]);
    }, [body]);

    const isValidTemplate: boolean = templateKeys.length > 0;

    const handleSubmit = async () => {
        if (!isValidTemplate) {
            alert("No valid keys found in the template.");
            return;
        }

        try{
            const templateObject: Template = {t_body: body, t_key: templateKeys.join(",")};

            const responseData = await saveEmailTemplate(templateObject);

            console.log("Response saved! ", responseData);

            setBody("");
            setTemplateKeys([]);

            alert("Template created successfully!");
        } catch (error) {
            console.error("Error saving template:", error);
            alert("Failed to create template. Please try again.");
        }


    };

    return (
        <div className="flex flex-col h-screen text-white">

            <div className="flex h-[82%] overflow-hidden">

                {/* left side - template rules and key detection */}
                <div className="flex flex-col w-[43%] p-6 space-y-6 overflow-y-auto border-r border-gray-700">
                    <h2 className="text-3xl font-bold mb-4">Make Template</h2>

                    <div className="space-y-3 bg-gray-900 p-4 rounded border border-gray-700">
                        <h3 className="text-xl font-semibold mb-2">Template Rules</h3>
                        <ul className="list-disc list-inside lg space-y-1 text-gray-300">
                            <li>Wrap the data keys in <code className="text-blue-400 font-mono">{"{{key_name}}"}</code></li>
                            <li>Use only letters, numbers, and underscores</li>
                            <li>No spaces or special characters inside keys</li>
                        </ul>
                    </div>

                    <div className="bg-gray-900 p-4 rounded border border-gray-700">
                        <h3 className="text-xl font-semibold mb-2">Detected Template Keys</h3>
                        {templateKeys.length > 0 ? (
                            <ul className="list-disc list-inside text-green-400 lg">
                                {templateKeys.map((key, idx) => (
                                    <li key={idx}>{key}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-red-500 text-sm">No valid keys found yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Panel - Template Editor */}
                <div className="w-[57%] p-6 flex flex-col">
                    <label className="block mb-2 font-semibold text-lg">📝 Template Body</label>
                    <textarea
                        className="flex-1 bg-gray-800 p-4 rounded w-full h-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Start typing your email... e.g. Hello {{user_name}}, your interview is on {{date}}."
                        value={body}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                    />
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex h-[10%] justify-end gap-4 p-3 pr-8 border-t border-gray-700 bg-gray-900">
                <button
                    onClick={handleSubmit}
                    disabled={!isValidTemplate}
                    className={`px-6 py-2 rounded ${
                        isValidTemplate
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-600 cursor-not-allowed"
                    }`}
                >
                    Save Template
                </button>
            </div>
        </div>
    );
}
