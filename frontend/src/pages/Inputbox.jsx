export function Inputbox({ label, placeholder, name, type = "text", value, onChange }) {
    return (
        <div>
            <label className="text-sm font-medium text-left py-2 block">{label}</label>
            <input
                type={type} // ✅ Ensures proper input type
                name={name} // ✅ Ensures the correct input field updates
                placeholder={placeholder}
                value={value} // ✅ Controlled input to sync with state
                onChange={onChange}
                required // ✅ Ensures form validation
                className="w-full px-2 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
}
