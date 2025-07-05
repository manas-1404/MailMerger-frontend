import { useState } from "react";
import type {Email} from "../types/email.ts";
import type {ListOfTemplates} from "../types/template.ts";

function WriteEmail( {templates}: ListOfTemplates ) {
    const [formData, setFormData] = useState<Email>({
        to_email: "",
        cc_email: "",
        bcc_email: "",
        subject: "",
        body: "",
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTemplateDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDropDownValue = e.target.value;
        const selectedTemplate = templates.find(t => t.tid === Number(selectedDropDownValue));

        if (selectedTemplate) {
            setFormData({
                ...formData,
                body: selectedTemplate.t_body
            })
        }
    }

    return (
        <div className="p-8 space-y-6 text-white">
            <h1 className="text-2xl font-bold">✉️ Write Email</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    name="to_email"
                    value={formData.to_email}
                    onChange={handleChange}
                    placeholder="Enter recipient's email"
                    className="bg-gray-800 p-2 rounded"
                    required={true}
                />
                <input
                    name="cc_email"
                    value={formData.cc_email}
                    onChange={handleChange}
                    placeholder="Enter CC email"
                    className="bg-gray-800 p-2 rounded"
                />
                <input
                    name="bcc_email"
                    value={formData.bcc_email}
                    onChange={handleChange}
                    placeholder="Enter BCC email"
                    className="bg-gray-800 p-2 rounded"
                />
                <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter email subject"
                    className="bg-gray-800 p-2 rounded"
                    required={true}
                />
            </div>

            <select onChange={handleTemplateDropdown} className="bg-gray-800 text-white p-2 rounded w-full">
                <option value="-1">Select a Template</option>
                {templates.map(t => (
                    <option key={t.tid} value={t.tid}>
                        {t.t_key}
                    </option>
                ))}
            </select>

            <div>
                <label className="block mb-2 mt-4">Body</label>
                <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    placeholder="Write your email here..."
                    className="bg-gray-800 p-4 rounded w-full h-40"
                    required={true}
                />
            </div>

            <button
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                onClick={() => console.log(formData)} // for now, just log it
            >
                Submit
            </button>
        </div>
    );
}

export default WriteEmail;
