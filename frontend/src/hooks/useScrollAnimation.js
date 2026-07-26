import { useEffect, useRef } from 'react';

/**
 * useScrollAnimation
 * Attaches IntersectionObserver to the returned ref.
 * When the element enters the viewport, it swaps CSS class from
 * `aos-hidden[-variant]` → `aos-visible[-variant]`.
 *
 * @param {string} variant  '' | '-left' | '-scale'
 * @param {string} delay    CSS transition-delay, e.g. '0.15s'
 */
export function useScrollAnimation(variant = '', delay = '0s') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial hidden class
    const hiddenClass = `aos-hidden${variant}`;
    const visibleClass = `aos-visible${variant}`;
    el.classList.add(hiddenClass);
    if (delay !== '0s') {
      el.style.transitionDelay = delay;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove(hiddenClass);
          el.classList.add(visibleClass);
          observer.unobserve(el); // trigger once
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, delay]);

  return ref;
}

export default useScrollAnimation;
