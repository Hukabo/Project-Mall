export default function PerforatedEdge({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="h-3 w-full"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #F7F4EC 25%, transparent 25%), linear-gradient(225deg, #F7F4EC 25%, transparent 25%)",
        backgroundSize: "12px 12px",
        backgroundPosition: flip ? "0 6px" : "0 0",
      }}
    />
  );
}
