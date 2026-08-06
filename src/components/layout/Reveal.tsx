import { useEffect, useRef, type ReactNode } from "react";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
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
        opacity: 0,
        transform: "translateY(24px)",
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