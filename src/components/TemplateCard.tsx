import type {Template, EditableTemplate} from "../types/template.ts";

export default function TemplateCard({ template, selected, onSelect, onEdit }: EditableTemplate) {
    return (
        <div className="flex justify-between items-center bg-gray-800 p-4 rounded border border-gray-700">
            <div>
                <p className="text-lg font-semibold">{template.t_key}</p>
                <p className="text-sm text-gray-400 line-clamp-2">{template.t_body}</p>
            </div>

            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect(template.template_id!)}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                    onClick={() => onEdit(template)}
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
