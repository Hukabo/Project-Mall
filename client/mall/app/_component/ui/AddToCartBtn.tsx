export default function AddToCartBtn({
  onSubmit,
  added,
  liked,
  onToggleLike,
}: {
  onSubmit: Function;
  added: boolean;
  liked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSubmit()}
        className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors border ${
          added
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {added ? "✓ 담겼습니다" : "장바구니"}
      </button>
      <button className="flex-1 h-11 rounded-lg text-sm font-medium bg-ink text-white hover:bg-ink/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        바로구매
      </button>
      <button
        type="button"
        onClick={onToggleLike}
        aria-label={liked ? "찜 해제하기" : "찜하기"}
        aria-pressed={liked}
        className={`w-11 h-11 rounded-lg border flex items-center justify-center text-lg transition-all duration-200 active:scale-90 ${
          liked
            ? "border-rust/40 bg-rust/5 text-rust"
            : "border-gray-200 text-gray-400 hover:text-rust hover:border-rust/40"
        }`}
      >
        {liked ? "♥" : "♡"}
      </button>
    </div>
  );
}
