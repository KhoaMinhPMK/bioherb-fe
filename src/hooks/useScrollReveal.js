import { useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Adds 'is-visible' class to elements with 'reveal' / 'reveal-left' / etc.
 * Supports stagger delays and respects prefers-reduced-motion.
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.15] - Visibility threshold (0-1)
 * @param {string} [options.rootMargin='0px 0px -60px 0px'] - Root margin
 */
export default function useScrollReveal(options = {}) {
    const containerRef = useRef(null);
    const { threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = options;

    const setupObserver = useCallback(() => {
        // Respect prefers-reduced-motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            // Immediately show all reveal elements
            const els = containerRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
            els?.forEach((el) => el.classList.add('is-visible'));
            return null;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin },
        );

        const els = containerRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        els?.forEach((el) => observer.observe(el));

        return observer;
    }, [threshold, rootMargin]);

    useEffect(() => {
        const observer = setupObserver();
        return () => observer?.disconnect();
    }, [setupObserver]);

    return containerRef;
}
