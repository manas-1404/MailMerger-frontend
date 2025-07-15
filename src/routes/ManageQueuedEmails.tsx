import { useEffect, useState } from "react";
import { getQueuedEmails, sendQueuedEmails, deleteQueuedEmails } from "../api/backend.ts";
import type { Email } from "../types/email";
import EmailCard from "../components/EmailCard";
import { useNavigate } from "react-router-dom";

export default function ManageQueuedEmails() {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmails = async () => {
            const emailsList: Email[] = await getQueuedEmails();
            setEmails(emailsList);
        };
        fetchEmails();
    }, []);

    const handleSelect = (eid: number) => {
        setSelected(prev =>
            prev.includes(eid) ? prev.filter(id => id !== eid) : [...prev, eid]
        );
    };

    const handleDelete = async () => {
        if (selected.length === 0) return;
        try {
            const deletedIds: number[] = await deleteQueuedEmails(selected);
            setEmails(prevState => prevState.filter(email => !deletedIds.includes(email.eid!)));
            setSelected([]);
            alert("Selected emails deleted.");
        } catch (err) {
            console.error(err);
            alert("Failed to delete emails.");
        }
    };

    const handleSendSelected = async () => {
        if (selected.length === 0) return;
        try {
            await sendQueuedEmails(selected);
            setEmails(prev => prev.filter(email => !selected.includes(email.eid!)));
            setSelected([]);
            alert("Selected emails sent.");
        } catch (err) {
            console.error(err);
            alert("Failed to send selected emails.");
        }
    };

    const handleSendAll = async () => {
        if (emails.length === 0) return;
        try {
            const allIds = emails.map(email => email.eid!).filter(Boolean);
            await sendQueuedEmails(allIds);
            setEmails([]);
            setSelected([]);
            alert("Initiated all emails processing.");
        } catch (err) {
            console.error(err);
            alert("Failed to send all emails.");
        }
    };

    const handleEdit = (email: Email) => {
        navigate("/write-email", { state: { editEmail: email } });
    };

    return (
        <div className="p-6 space-y-4 text-white">
            <h2 className="text-3xl font-bold mb-4">📬 Manage Queued Emails</h2>

            {emails.length > 0 ? (
                <div className="space-y-3">
                    {emails.map(email => (
                        <EmailCard
                            key={email.eid}
                            email={email}
                            selected={selected.includes(email.eid!)}
                            onSelect={handleSelect}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No queued emails found.</p>
            )}

            {emails.length > 0 && (
                <div className="mt-4 flex gap-4">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
                        onClick={handleSendAll}
                    >
                        Send All Emails
                    </button>

                    {selected.length > 0 && (
                        <>
                            <button
                                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded"
                                onClick={handleSendSelected}
                            >
                                Send Selected ({selected.length})
                            </button>

                            <button
                                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
                                onClick={handleDelete}
                            >
                                Delete Selected ({selected.length})
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
