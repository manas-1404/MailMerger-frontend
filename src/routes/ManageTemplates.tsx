import { useEffect, useState } from "react";
import { getEmailTemplates, deleteEmailTemplates } from "../api/backend.ts";
import type {ListOfTemplates, Template} from "../types/template.ts";
import TemplateCard from "../components/TemplateCard.tsx";
import { useNavigate } from "react-router-dom";

export default function ManageTemplates() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplates = async () => {
            const response: ListOfTemplates = await getEmailTemplates();
            setTemplates(response.templates);
        };
        fetchTemplates();
    }, []);

    const handleSelect = (id: number) => {
        setSelected(prevState =>
            prevState.includes(id) ? prevState.filter(i => i !== id) : [...prevState, id]
        );
    };

    const handleDelete = async () => {
        if (selected.length === 0) {
            return;
        }

        try {

            const deleteTemplatesList: number[] = await deleteEmailTemplates(selected);

            setTemplates(prevState => prevState.filter(t => !deleteTemplatesList.includes(t.template_id!)));
            setSelected([]);
            alert("Selected templates deleted.");
        } catch (err) {
            console.error(err);
            alert("Failed to delete some templates.");
        }
    };

    const handleEdit = (emailTemplate: Template) => {
        navigate("/make-template", { state: { emailTemplate } });
    };

    return (
        <div className="p-6 space-y-4 text-white">
            <h2 className="text-3xl font-bold mb-4">Manage Templates</h2>

            {templates.length > 0 ? (
                <div className="space-y-3">
                    {templates.map(template => (
                        <TemplateCard
                            key={template.template_id}
                            template={template}
                            selected={selected.includes(template.template_id!)}
                            onSelect={handleSelect}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No templates found.</p>
            )}

            {selected.length > 0 && (
                <button
                    className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
                    onClick={handleDelete}
                >
                    Delete Selected ({selected.length})
                </button>
            )}
        </div>
    );
}
