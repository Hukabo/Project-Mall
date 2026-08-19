export default function ProductInputField({
  form,
  setForm,
  id,
  type = "text",
  text,
  subText,
  placeholder,
  required,
}: any) {
  return (
    <div className="px-4 py-3 border border-line rounded-md shadow flex-1 flex flex-col justify-center">
      <label htmlFor={id} className="">
        {text}
        {required && <span className="text-red-500"> *</span>}
        <p className="text-sm text-gray-500">{subText}</p>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-line"
        placeholder={`예: ${placeholder}`}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
      />
    </div>
  );
}
