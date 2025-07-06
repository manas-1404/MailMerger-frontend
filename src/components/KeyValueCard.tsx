import type { TemplateKeyValue } from "../types/template.ts";

function KeyValueCard({ t_key, t_value, onValueChange }: TemplateKeyValue) {
    return (
        <div className="flex items-center mb-4 gap-7">
            {t_key && (
                <div className="w-1/4 text-right text-white font-semibold">
                    {t_key.toUpperCase()}
                </div>
            )}

            <input
                className={`${t_key ? "w-3/4" : "w-full"} bg-gray-800 text-white p-2 rounded`}
                value={t_value ?? ""}
                onChange={(e) => {
                    if (onValueChange && t_key) {
                        onValueChange(t_key, e.target.value);
                    }
                }}
                placeholder={t_key ? `Enter value for ${t_key}` : "Enter value"}
                required={true}
            />
        </div>
    );
}

export default KeyValueCard;
