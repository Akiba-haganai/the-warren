import { motion } from "framer-motion";

export function NetworkGrid() {
  const nodes = Array.from({ length: 24 }, (_, i) => ({
    x: (i * 137) % 100,
    y: (i * 73) % 100,
  }));

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="g">
          <stop offset="0%" stopColor="oklch(0.55 0.22 255)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.45 0.19 265)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {nodes.map((n, i) =>
        nodes.slice(i + 1, i + 4).map((m, j) => (
          <line
            key={`${i}-${j}`}
            x1={n.x}
            y1={n.y}
            x2={m.x}
            y2={m.y}
            stroke="url(#g)"
            strokeWidth="0.08"
          />
        )),
      )}

      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r="0.4"
          fill="oklch(0.55 0.22 255)"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </svg>
  );
}

