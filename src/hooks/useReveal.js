import { gsap, ScrollTrigger, SplitText, useGSAP, EASE, MOTION_OK } from '../lib/gsap.js';

/*
 * Declarative scroll reveals, scoped to one section. Mark elements up with:
 *
 *   data-reveal="lines"    masked line-by-line rise (headings only)
 *   data-reveal="up"       single element rises + fades in
 *   data-reveal="stagger"  direct children rise in sequence
 *   data-speed="8"         scrubbed parallax drift, in yPercent
 *
 * Optional: data-delay="0.2", data-start="top 95%", and data-trigger="#selector"
 * (use the latter for elements inside CSS-sticky containers, whose measured
 * position is unreliable).
 *
 * Start positions are clamp()ed to the scrollable range: without that, anything
 * near the very end of the page (the footer) can never scroll far enough up to
 * reach its trigger point and would stay invisible.
 *
 * Everything is skipped under prefers-reduced-motion, so content is simply there.
 */
export default function useReveal(scopeRef) {
    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add(MOTION_OK, () => {
                const q = gsap.utils.selector(scopeRef);
                const triggerFor = (el) =>
                    (el.dataset.trigger && document.querySelector(el.dataset.trigger)) || el;
                const startFor = (el, fallback) => `clamp(${el.dataset.start || fallback})`;

                q('[data-reveal="lines"]').forEach((el) => {
                    SplitText.create(el, {
                        type: 'lines',
                        mask: 'lines',
                        linesClass: 'split-line',
                        autoSplit: true,
                        // Returning the tween lets SplitText keep its progress
                        // when it re-splits on resize, so it doesn't replay.
                        onSplit: (self) =>
                            gsap.from(self.lines, {
                                yPercent: 110,
                                duration: 1.2,
                                ease: EASE.reveal,
                                stagger: 0.1,
                                delay: Number(el.dataset.delay) || 0,
                                scrollTrigger: { trigger: triggerFor(el), start: startFor(el, 'top 88%'), once: true },
                            }),
                    });
                });

                q('[data-reveal="up"]').forEach((el) => {
                    gsap.from(el, {
                        y: 40,
                        autoAlpha: 0,
                        duration: 1.2,
                        ease: EASE.reveal,
                        delay: Number(el.dataset.delay) || 0,
                        scrollTrigger: { trigger: triggerFor(el), start: startFor(el, 'top 90%'), once: true },
                    });
                });

                q('[data-reveal="stagger"]').forEach((el) => {
                    gsap.from(el.children, {
                        y: 28,
                        autoAlpha: 0,
                        duration: 1,
                        ease: EASE.reveal,
                        stagger: 0.08,
                        delay: Number(el.dataset.delay) || 0,
                        scrollTrigger: { trigger: triggerFor(el), start: startFor(el, 'top 88%'), once: true },
                    });
                });

                q('[data-speed]').forEach((el) => {
                    const amount = Number(el.dataset.speed) || 6;
                    gsap.fromTo(
                        el,
                        { yPercent: amount },
                        {
                            yPercent: -amount,
                            ease: 'none',
                            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
                        },
                    );
                });
            });

            // Late layout changes (web font swap, images decoding) shift trigger
            // positions; recompute once things have settled.
            document.fonts?.ready.then(() => ScrollTrigger.refresh());
        },
        { scope: scopeRef },
    );
}
