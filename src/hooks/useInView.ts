import { useEffect, useRef, useState } from "react";

/**
 * useInView — returns a [ref, inView] tuple.
 * `inView` becomes true once the element enters the viewport and stays true
 * (one-shot latch), so the caller can use it as a fetch gate without
 * re-triggering on scroll.
 *
 * @param rootMargin  Extra margin around the root viewport (default "200px").
 *                    A positive bottom margin means the fetch fires ~200 px
 *                    *before* the section scrolls into view — giving the
 *                    network time to resolve before the user reaches it.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px 200px 0px"
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView] as const;
}
