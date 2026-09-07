export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      style={{ backgroundColor: "#F2EFE6", color: "#22281F" }}
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: "#DDD6C4", borderTopColor: "#5B6B4F" }}
        role="status"
        aria-label="로딩 중"
      />
      <p
        className="font-mono text-xs tracking-widest"
        style={{ color: "#5B6357" }}
      >
        LOADING…
      </p>
    </div>
  );
}
