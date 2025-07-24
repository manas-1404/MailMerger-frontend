import {useEffect, useState} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import type {Email} from "../types/email.ts";
import type {ListOfTemplates, Template} from "../types/template.ts";

import KeyValueCard from "../components/KeyValueCard.tsx";
import {addToEmailQueue, getEmailTemplates, sendEmailNow} from "../api/backend.ts";

function WriteEmail() {

    useEffect(() => {

        const loadEmailTemplates = async () =>{
            try{
                 const templatesList: ListOfTemplates = await getEmailTemplates();

                 setTemplatesList(templatesList);

                 console.log("the templates list is: \n", templatesList);

            } catch (error) {
                console.error("Error fetching email templates:", error);
                alert("Failed to load email templates. Please try again later.");
            }
        }

        loadEmailTemplates();

    }, [])

    const [formData, setFormData] = useState<Email>({
        to_email: "",
        cc_email: "",
        bcc_email: "",
        subject: "",
        body: "",
        include_resume: false,
    });

    const [mapping, setMapping] = useState<Record<string, string>>({});

    const [invalidMappingKeys, setInvalidMappingKeys] = useState<string[]>([]);

    const [templatesList, setTemplatesList] = useState<ListOfTemplates>(
        {templates: [
                {
                    template_id: -100,
                    uid: -100,
                    t_key: "Start by making a template",
                    t_body: "Make sure to use the format {{key_name}} for template keys."
                }
            ]
        }
    );

    const [templateBackup, setTemplateBackup] = useState<string>("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: formData.body,
        onCreate: ({ editor }) => {
            editor.chain().focus().setTextAlign('left').run();
        },
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, body: editor.getHTML() }));
        },
    });

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

        const selectedTemplate: Template | undefined = templatesList.templates.find(t => t.template_id === Number(selectedDropDownValue));

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

            editor.commands.setContent(selectedTemplate.t_body);
            editor.chain().focus().setTextAlign('left').run();
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

        editor.commands.setContent(mergedBody);
        editor.chain().focus().setTextAlign('left').run();
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

        editor.commands.setContent(templateBackup);
        editor.chain().focus().setTextAlign('left').run();
    }

    const isEmailValid = (): boolean => {
        const { to_email, cc_email, bcc_email, subject, body } = formData;

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

        //checking if the email addresses are valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmails = (value: string): boolean => {
            return value
                .split(",")
                .map(e => e.trim())
                .every(email => emailRegex.test(email));
        };

        if (!isValidEmails(to_email)) {
            return false;
        }

        if (cc_email && cc_email.trim() && !isValidEmails(cc_email)) {
            return false;
        }

        if (bcc_email && bcc_email.trim() && !isValidEmails(bcc_email)) {
            return false;
        }

        return true;
    };


    const handleSendNow = async () => {
        if (!isEmailValid()) {
            alert("Please fill out all required fields and complete the template if selected.");
            return;
        }

        try {
            console.log("Sending email...\n", formData);

            const responseData = await sendEmailNow(formData);

            if (responseData){
                console.log("Email sent successfully:", responseData);
                alert("Email sent successfully!");
            }else{
                alert("Failed to send email. Please ensure you have granted Google OAuth permissions.");
            }

            setMapping({});
            setFormData({
                to_email: "",
                cc_email: "",
                bcc_email: "",
                subject: "",
                body: "",
                include_resume: false,
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
            console.log("Adding email to queue...\n", formData);

            const responseData = await addToEmailQueue(formData);

            console.log("Email added to queue successfully:", responseData);

            alert("Email added to queue!");

            setMapping({});
            setFormData({
                to_email: "",
                cc_email: "",
                bcc_email: "",
                subject: "",
                body: "",
                include_resume: false,
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
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="include_resume"
                            name="include_resume"
                            checked={formData.include_resume}
                            onChange={(e) =>
                                setFormData((prevState) => ({
                                    ...prevState,
                                    include_resume: e.target.checked,
                                }))
                            }
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label htmlFor="include_resume" className="text-sm font-medium">
                            Include resume with the email
                        </label>
                    </div>

                    {/* choose template dropdown */}
                    <div>
                        <label className="block mb-2 font-semibold">📄 Choose Template</label>
                        <select
                            onChange={handleTemplateDropdown}
                            className="bg-gray-800 text-white p-3 rounded w-full border border-gray-700"
                        >
                            <option key="default" value="-1">Select a Template</option>
                            {templatesList.templates.map((t) => (
                                <option key={t.template_id} value={t.template_id}>
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
                    <div className="flex flex-row flex-wrap gap-2 mb-3 bg-gray-900 p-2 rounded border border-gray-700">
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`p-2 rounded ${
                                editor?.isActive("bold") ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Bold
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded ${
                                editor?.isActive("italic") ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Italic
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            className={`p-2 rounded ${
                                editor?.isActive("bulletList") ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Bullets
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            className={`p-2 rounded ${
                                editor?.isActive("orderedList") ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Numbers
                        </button>

                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                            className={`p-2 rounded ${
                                editor?.isActive({ textAlign: "left" })
                                    ? "bg-blue-600"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Left
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                            className={`p-2 rounded ${
                                editor?.isActive({ textAlign: "center" })
                                    ? "bg-blue-600"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Center
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                            className={`p-2 rounded ${
                                editor?.isActive({ textAlign: "right" })
                                    ? "bg-blue-600"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Right
                        </button>
                        <button
                            type="button"
                            onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                            className={`p-2 rounded ${
                                editor?.isActive({ textAlign: "justify" })
                                    ? "bg-blue-600"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            Justify
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                const url = prompt("Enter URL");
                                if (url) editor?.chain().focus().setLink({ href: url }).run();
                            }}
                            className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                        >
                            Link
                        </button>
                    </div>

                    <div
                        className="flex-1 border border-gray-700 rounded bg-gray-800 p-4 editor-wrapper"
                        onClick={() => editor?.chain().focus().run()}
                    >
                        <EditorContent editor={editor} className="tiptap" />
                    </div>
                </div>
            </div>

            {/* bottom buttons */}
            <div className="flex h-[10%] justify-end gap-4 p-3 pr-8 border-t border-gray-700 bg-gray-900">
                <button
                    className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded"
                    onClick={handleAddToQueue}
                >
                    Add to Queue
                </button>
                <button
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                    onClick={handleSendNow}
                >
                    Send Now
                </button>
            </div>
        </div>

    );
}

export default WriteEmail;
