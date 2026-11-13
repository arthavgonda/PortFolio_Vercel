// Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger and Lenis
// read the exact same scroll position on the exact same frame.
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

let lenis = null;

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initSmoothScroll() {
    if (lenis || prefersReducedMotion()) return () => {};

    lenis = new Lenis({ lerp: 0.1, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = null;
    };
}

// Locks scroll while the splash screen is up. Works with or without Lenis
// (Lenis is disabled for reduced motion; touch devices scroll natively).
export function setScrollLocked(locked) {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    if (!lenis) return;
    if (locked) lenis.stop();
    else lenis.start();
}

const NAV_OFFSET = -72;

export function scrollToTarget(target, { offset = NAV_OFFSET, immediate = false } = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    if (lenis) {
        lenis.scrollTo(el, { offset, immediate, duration: immediate ? 0 : 1.4 });
        return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
}

// Click handler for in-page anchor links: smooth-scrolls instead of jumping.
export function handleAnchorClick(event) {
    const href = event.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    event.preventDefault();
    scrollToTarget(href, href === '#home' ? { offset: 0 } : undefined);
}
