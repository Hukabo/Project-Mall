export default function Button({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <button
      className={`block px-3 py-2 bg-ink hover:bg-ink/80 rounded-md text-white shadow ${className}`}
    >
      {text}
    </button>
  );
}
