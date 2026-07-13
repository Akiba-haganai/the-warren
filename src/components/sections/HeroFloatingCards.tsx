import { motion } from "framer-motion";
import { Users, Home, Briefcase, Podcast } from "lucide-react";

export function FloatingCards() {
  const cards = [
    { icon: Users, label: "Communities", pos: "left-4 top-10 md:left-16 md:top-20" },
    { icon: Home, label: "Accommodation", pos: "right-4 top-24 md:right-20 md:top-40" },
    { icon: Briefcase, label: "Jobs", pos: "left-8 bottom-10 md:left-24 md:bottom-24" },
    { icon: Podcast, label: "Podcasts", pos: "right-8 bottom-16 md:right-16 md:bottom-8" },
  ];

  return (
    <div className="hidden md:block">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: 0.6 + i * 0.15 },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
          }}
          className={`absolute ${c.pos} glass rounded-2xl px-4 py-3 flex items-center gap-2 shadow-elegant`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <c.icon className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">{c.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

