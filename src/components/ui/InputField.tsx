interface InputFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    type?: string;
    large?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function InputField({
    label,
    placeholder,
    value,
    type = "text",
    large = false,
    onChange
}: InputFieldProps) {
    const inputId = label ? label.toLowerCase().replace(/\s+/g, '-') : "input-field";
    return (
        <div className="w-full space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-bold text-gray-500"
                >
                    {label}
                </label>
            )}

            {
                large ? (
                    <textarea
                        id={inputId}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                        rows={4}
                    />
                ) :
                    (
                        <input type={type} id={inputId} placeholder={placeholder} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200" />
                    )
            }
        </div>
    )
}