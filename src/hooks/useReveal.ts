import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver hook: adiciona a classe `in` ao elemento
 * quando ele entra na viewport (threshold 0.2, rootMargin "-6%").
 * Observa uma vez e para.
 */
export function useReveal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return ref;
}
