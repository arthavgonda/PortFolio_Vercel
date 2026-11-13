import { useEffect, useState } from 'react';

// Tracks whether an element intersects the viewport (grown by rootMargin).
// With `once`, it latches to true the first time and stops observing.
export default function useInView(ref, { rootMargin = '0px', once = false } = {}) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (once) {
                    if (entry.isIntersecting) {
                        setInView(true);
                        observer.disconnect();
                    }
                } else {
                    setInView(entry.isIntersecting);
                }
            },
            { rootMargin },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, rootMargin, once]);

    return inView;
}
