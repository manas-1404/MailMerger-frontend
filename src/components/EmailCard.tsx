import type { QueuedEmail } from "../types/email.ts";

export default function EmailCard({ email, selected, onSelect, onEdit }: QueuedEmail) {
    return (
        <div className="p-4 border border-gray-600 rounded bg-gray-800 flex justify-between items-start">
            <div className="space-y-1 w-full">
                <div><strong>To:</strong> {email.to_email}</div>
                {email.cc_email && <div><strong>CC:</strong> {email.cc_email}</div>}
                {email.bcc_email && <div><strong>BCC:</strong> {email.bcc_email}</div>}
                <div><strong>Subject:</strong> {email.subject}</div>
                <div className="text-gray-400"><strong>Body:</strong> {email.body.slice(0, 100)}...</div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect(email.eid!)}
                />
                <button
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={() => onEdit(email)}
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
