import { useState } from "react";
import type {Email} from "../types/email.ts";
import type {ListOfTemplates, Template} from "../types/template.ts";

import KeyValueCard from "../components/KeyValueCard.tsx";

function WriteEmail( {templates}: ListOfTemplates ) {
    const [formData, setFormData] = useState<Email>({
        to_email: "",
        cc_email: "",
        bcc_email: "",
        subject: "",
        body: "",
    });

    const [mapping, setMapping] = useState<Record<string, string>>({});

    const [invalidMappingKeys, setInvalidMappingKeys] = useState<string[]>([]);

    const [templateBackup, setTemplateBackup] = useState<string>("");

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTemplateDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDropDownValue: string = e.target.value;

        // the user selected default option, so remove everything or go back to normal
        if (selectedDropDownValue === "-1") {
            setMapping({});
            setInvalidMappingKeys([]);
            setTemplateBackup("");
            setFormData(prev => ({ ...prev, body: "" }));
            return;
        }

        const selectedTemplate: Template | undefined = templates.find(t => t.tid === Number(selectedDropDownValue));

        if (selectedTemplate) {

            setTemplateBackup(selectedTemplate.t_body);

            //update the mapping state with the template keys selected by the user through the dropdown
            const mappingKeys: string[] = selectedTemplate.t_key.split(",").map(key => key.trim());

            //update the mapping state to have a new object with new keys everytime a template is selected or changed
            const newMapping: Record<string, string> = {};
            mappingKeys.forEach(key => {
                newMapping[key] = "";
            });
            setMapping(newMapping);


            setFormData({
                ...formData,
                body: selectedTemplate.t_body
            })
        }
    }

    const updateValueCallback = (t_key: string, newValue: string) => {
        setMapping(prevState => {
            return {...prevState, [t_key]: newValue};
            }
        );
    }

    const handleMailMerge = () => {

        const invalidKeys: string[] = [];

        for (const [key, value] of Object.entries(mapping)) {
            if (!value || value.trim().length === 0) {
                invalidKeys.push(key);
            }
        }

        if (invalidKeys.length > 0) {
            setInvalidMappingKeys(invalidKeys);
            return;
        }


        let mergedBody = formData.body;

        for (const [key, value] of Object.entries(mapping)) {
            const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
            mergedBody = mergedBody.replace(pattern, value);
        }

        setFormData(prevState => {
            return {...prevState, body: mergedBody};
        })

    }

    const handleGoBackToTemplate = () => {
        setFormData(prevState => {
            return {...prevState, body: templateBackup};
        });

        setInvalidMappingKeys([]);

        const clearedMapping: Record<string, string> = {};
        Object.keys(mapping).forEach(key => {
            clearedMapping[key] = "";
        });

        setMapping(clearedMapping);
    }

    const isEmailValid = (): boolean => {
        const { to_email, subject, body } = formData;

        //checking basic required fields
        if (!to_email.trim() || !subject.trim() || !body.trim()) {
            return false;
        }

        //checking that all template values are filled
        if (Object.keys(mapping).length > 0) {
            for (const value of Object.values(mapping)) {
                if (!value || value.trim().length === 0) {
                    return false;
                }
            }

            //checking if the mail merge has actually occurred
            const templatePlaceholderPattern = /{{\s*[\w]+\s*}}/g;
            if (templatePlaceholderPattern.test(body)) {
                return false;
            }
        }

        return true;
    };


    const handleSendNow = async () => {
        if (!isEmailValid()) {
            alert("Please fill out all required fields and complete the template if selected.");
            return;
        }

        try {
            // TODO: add method from the utils to call backend aip
            console.log("Sending email...\n", formData);
            alert("Email sent successfully!");

            setMapping({});
            setFormData({
                to_email: "",
                cc_email: "",
                bcc_email: "",
                subject: "",
                body: "",
            });
            setTemplateBackup("");
            setInvalidMappingKeys([]);

        } catch (err) {
            console.error("Send failed", err);
            alert("Failed to send email.");
        }
    };

    const handleAddToQueue = async () => {
        if (!isEmailValid()) {
            alert("Please fill out all required fields and complete the template if selected.");
            return;
        }

        try {
            // TODO: add method from the utils to call backend aip
            console.log("Sending email...\n", formData);
            alert("Email added to queue!");

            setMapping({});
            setFormData({
                to_email: "",
                cc_email: "",
                bcc_email: "",
                subject: "",
                body: "",
            });
            setTemplateBackup("");
            setInvalidMappingKeys([]);
        } catch (err) {
            console.error("Queue failed", err);
            alert("Failed to add email to queue.");
        }
    };



    return (
        <div className="flex flex-col h-screen text-white">

            <div className="flex h-[82%] overflow-hidden">

                {/* left side - Email Details */}
                <div className="flex flex-col w-[43%] p-6 space-y-6 overflow-y-auto border-r border-gray-700">
                    <h2 className="text-3xl font-bold mb-4">✉️ Write Email</h2>

                    <div className="grid grid-cols-1 gap-4">
                        {["to_email", "cc_email", "bcc_email", "subject"].map((field) => (
                            <input
                                key={field}
                                name={field}
                                value={(formData as any)[field]}
                                onChange={handleChange}
                                placeholder={`Enter ${field.replace("_", " ")}`}
                                className="bg-gray-800 p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required={field === "to_email" || field === "subject"}
                            />
                        ))}
                    </div>

                    {/* choose template dropdown */}
                    <div>
                        <label className="block mb-2 font-semibold">📄 Choose Template</label>
                        <select
                            onChange={handleTemplateDropdown}
                            className="bg-gray-800 text-white p-3 rounded w-full border border-gray-700"
                        >
                            <option value="-1">Select a Template</option>
                            {templates.map((t) => (
                                <option key={t.tid} value={t.tid}>
                                    {t.t_key}
                                </option>
                            ))}
                        </select>
                    </div>

                    {Object.keys(mapping).length > 0 && (
                        <div className="p-4 rounded border border-gray-700 bg-gray-900 space-y-4">
                            <h2 className="text-xl font-bold">🔁 Fill in Template Fields</h2>
                            <div className="space-y-3">
                                {Object.entries(mapping).map(([key, value]) => (
                                    <KeyValueCard
                                        key={key}
                                        t_key={key}
                                        t_value={value}
                                        onValueChange={updateValueCallback}
                                        isInvalid={invalidMappingKeys.includes(key)}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-end gap-4 pt-2">
                                <button
                                    className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded"
                                    onClick={handleGoBackToTemplate}
                                >
                                    ⬅️ Back
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
                                    onClick={handleMailMerge}
                                >
                                    🔄 Mail Merge
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* right side - Email writin Body space */}
                <div className="w-[57%] p-6 flex flex-col">
                    <label className="block mb-2 font-semibold text-lg">📝 Email Body</label>
                    <textarea
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        placeholder="Write your email here..."
                        className="flex-1 bg-gray-800 p-4 rounded w-full h-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        required
                    />
                </div>
            </div>

            {/* bottom buttons */}
            <div className="flex h-[10%] justify-end gap-4 p-3 pr-8 border-t border-gray-700 bg-gray-900">
                <button
                    className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded"
                    onClick={handleAddToQueue}
                >
                    🕒 Add to Queue
                </button>
                <button
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                    onClick={handleSendNow}
                >
                    🚀 Send Now
                </button>
            </div>
        </div>

    );
}

export default WriteEmail;
