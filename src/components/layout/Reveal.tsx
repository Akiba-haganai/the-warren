import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Reveal — lightweight fade+slide-up on scroll.
 * Uses IntersectionObserver + CSS transitions — no framer-motion dependency.
 * Same visual result, zero library weight.
 */
export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use setState — never mutate el.style directly inside an
          // IntersectionObserver callback. Direct DOM mutations bypass React's
          // reconciler and cause NotFoundError on iOS Safari during unmount.
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "-80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium tracking-wide text-blue-600 dark:text-blue-300 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse-glow" />
      {children}
    </div>
  );
}