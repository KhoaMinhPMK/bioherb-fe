import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Animates a number from 0 to `end` when element scrolls into view.
 * Returns [ref, displayValue].
 *
 * @param {number|string} end - Target value (supports '100%', '0s', etc.)
 * @param {Object} options
 * @param {number} [options.duration=1200] - Animation duration in ms
 */
export default function useCountUp(end, options = {}) {
    const { duration = 1200 } = options;
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    // Extract numeric part
    const numericEnd = parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0;
    const suffix = String(end).replace(/[0-9.]/g, '');

    const [display, setDisplay] = useState(`0${suffix}`);

    const animate = useCallback(() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericEnd);

            setDisplay(`${current}${suffix}`);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                setDisplay(`${numericEnd % 1 === 0 ? numericEnd : numericEnd.toFixed(1)}${suffix}`);
            }
        }

        requestAnimationFrame(tick);
    }, [numericEnd, suffix, duration]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            setDisplay(String(end));
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animate();
                    observer.disconnect();
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [animate, end]);

    return [ref, display];
}
