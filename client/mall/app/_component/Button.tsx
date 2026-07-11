export default function Button({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <button
      className={`block px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white shadow ${className}`}
    >
      {text}
    </button>
  );
}
