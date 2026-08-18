import { useEffect } from 'react';

/**
 * useScrollReveal — Automatically observes all .reveal elements on the page,
 * including dynamically loaded / async sections.
 */
export function useScrollReveal(deps = [], options = {}) {
  const { threshold = 0.05, rootMargin = '0px 0px -20px 0px' } = options;

  useEffect(() => {
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const checkAndObserve = () => {
      const elements = document.querySelectorAll(selectors);
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in viewport or above, reveal immediately
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        } else if (!el.classList.contains('visible')) {
          observer.observe(el);
        }
      });
    };

    // Immediate execution
    checkAndObserve();

    // MutationObserver to watch for dynamically added elements in DOM
    const mutationObserver = new MutationObserver(() => {
      checkAndObserve();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Safety intervals
    const t1 = setTimeout(checkAndObserve, 50);
    const t2 = setTimeout(checkAndObserve, 300);
    const t3 = setTimeout(checkAndObserve, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [threshold, rootMargin, ...deps]);
}

export default useScrollReveal;
