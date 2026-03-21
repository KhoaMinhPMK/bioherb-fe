import { useState, useEffect } from 'react';

/**
 * Hook kiểm tra viewport có phải mobile hay không.
 * @param {number} breakpoint - Mặc định 768px (khớp với $bp-md trong var.scss)
 * @returns {boolean} true nếu viewport ≤ breakpoint
 */
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(
        () => window.innerWidth <= breakpoint
    );

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

        const handleChange = (e) => {
            setIsMobile(e.matches);
        };

        // Modern browsers
        if (mql.addEventListener) {
            mql.addEventListener('change', handleChange);
        } else {
            // Safari < 14 fallback
            mql.addListener(handleChange);
        }

        // Sync initial value
        setIsMobile(mql.matches);

        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handleChange);
            } else {
                mql.removeListener(handleChange);
            }
        };
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
