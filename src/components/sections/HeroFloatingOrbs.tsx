export function FloatingOrbs() {
  return (
    <>
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl animate-float" />
      <div
        className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-blue-700/20 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-pulse-glow" />
    </>
  );
}

