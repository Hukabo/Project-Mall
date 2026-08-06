export default function AddVariantBtn({
  addVariant,
}: {
  addVariant: () => void;
}) {
  return (
    <div className="flex justify-center items-center p-4">
      <button
        type="button"
        className="w-full py-2 border-2 border-line border-dashed bg-surface text-gray-400 rounded-sm mx-auto hover:bg-grey-light-1 text-xl"
        onClick={() => addVariant()}
      >
        &oplus;
      </button>
    </div>
  );
}
