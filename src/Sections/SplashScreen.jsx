import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap, useGSAP, EASE } from '../lib/gsap.js';
import { prefersReducedMotion } from '../lib/scroll.js';

const MIN_SHOW_MS = 1700; // long enough for "Wel" + "come." to land
const MAX_WAIT_MS = 12000; // a stalled download must never trap the visitor here

const SplashScreen = ({ ready, onExitStart, onComplete }) => {
    const rootRef = useRef(null);
    const barRef = useRef(null);
    const shown = useRef(0);

    const [minElapsed, setMinElapsed] = useState(false);
    const [fontsReady, setFontsReady] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    // Real progress from three.js' loading manager (models + textures).
    const { progress } = useProgress();

    useEffect(() => {
        const min = setTimeout(() => setMinElapsed(true), prefersReducedMotion() ? 300 : MIN_SHOW_MS);
        const max = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
        if (document.fonts) document.fonts.ready.then(() => setFontsReady(true));
        else setFontsReady(true);
        return () => {
            clearTimeout(min);
            clearTimeout(max);
        };
    }, []);

    // Files join the queue as parsing discovers them, which can make the raw
    // percentage dip. The bar only ever moves forward.
    useEffect(() => {
        shown.current = Math.max(shown.current, progress / 100);
        gsap.to(barRef.current, { scaleX: shown.current, duration: 0.6, ease: 'power3.out', overwrite: true });
    }, [progress]);

    const canLeave = minElapsed && ((ready && fontsReady) || timedOut);

    useGSAP(
        () => {
            if (!canLeave) return;

            if (prefersReducedMotion()) {
                onExitStart?.();
                gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.4, onComplete });
                return;
            }

            gsap.timeline({ onComplete })
                .to(barRef.current, { scaleX: 1, duration: 0.35, ease: 'power3.out', overwrite: true })
                .to('[data-splash="content"]', { y: -24, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0.3)
                // The hero starts its entrance while the curtain is still moving,
                // so the two read as one continuous motion.
                .add(() => onExitStart?.(), 0.55)
                .to(rootRef.current, { yPercent: -100, duration: 1, ease: EASE.curtain }, 0.55);
        },
        { dependencies: [canLeave], scope: rootRef },
    );

    return (
        <div ref={rootRef} className="splash-screen" role="status" aria-label="Loading">
            <div data-splash="content" className="flex flex-col items-center gap-10">
                <h1 className="welcome-text" aria-hidden="true">
                    <span className="wel-text">Wel</span>
                    <span className="come-text">come.</span>
                </h1>
                <div className="splash-progress" aria-hidden="true">
                    <span ref={barRef} className="splash-progress-bar" />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
