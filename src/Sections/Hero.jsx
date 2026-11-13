import { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';

import { gsap, ScrollTrigger, SplitText, useGSAP, EASE, MOTION_OK } from '../lib/gsap.js';
import { handleAnchorClick } from '../lib/scroll.js';
import { hasWebGL } from '../lib/webgl.js';
import { calculateSizes } from '../constants/index.js';
import SceneCanvas from '../components/SceneCanvas.jsx';
import CanvasLoader from '../components/CanvasLoader.jsx';
import HackerRoom from '../components/HackerRoom.jsx';
import ReactLogo from '../components/ReactLogo.jsx';
import Cube from '../components/Cube.jsx';
import Rings from '../components/Rings.jsx';
import HeroCamera from '../components/HeroCamera.jsx';
import Button from '../components/Button.jsx';

const easeOutBack = (t, s = 1.7) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;

// Scales a floating prop up from nothing during the intro. `delay` is where it
// starts on the 0→1 `props` timeline, so the three props land one after another.
const PopIn = ({ motion, delay, position, children }) => {
    const ref = useRef();
    useFrame(() => {
        const t = Math.min(Math.max((motion.current.props - delay) / 0.5, 0), 1);
        ref.current.scale.setScalar(Math.max(easeOutBack(t), 1e-4));
    });
    return (
        <group ref={ref} position={position} scale={1e-4}>
            {children}
        </group>
    );
};

// Mounted inside <Suspense>, so it only runs once every model and texture has
// resolved. Waiting a few rendered frames means shaders are compiled too, so
// the splash never lifts onto a stutter.
const SceneReady = ({ onReady }) => {
    const frames = useRef(0);
    useFrame(() => {
        frames.current += 1;
        if (frames.current === 3) onReady?.();
    });
    return null;
};

// A still of the 3D scene, rendered from the real thing, for browsers that
// can't run WebGL.
// Intro animates the <img>, scroll-exit animates the frame, so the two never
// fight over the same transform.
const HeroPoster = () => (
    <div data-hero="poster-frame" className="w-full h-full">
        <picture>
            <source media="(max-width: 768px)" srcSet="/assets/fallback/hero-mobile.webp" />
            <img
                data-hero="poster"
                src="/assets/fallback/hero-desktop.webp"
                alt=""
                decoding="async"
                className="w-full h-full object-cover"
            />
        </picture>
    </div>
);

const Hero = ({ onAssetsLoaded, introStarted }) => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const titleRef = useRef(null);
    const ctaRef = useRef(null);
    // Shared with the 3D scene; written by GSAP, read in useFrame.
    const motion = useRef({ intro: 0, props: 0, exit: 0 });

    const isSmall = useMediaQuery({ maxWidth: 440 });
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    // Argument order matches the signature (it was passed tablet/mobile swapped).
    const sizes = calculateSizes(isSmall, isMobile, isTablet);

    // Without WebGL there's no scene to wait for: let the splash go right away.
    useEffect(() => {
        if (!hasWebGL()) onAssetsLoaded?.();
    }, [onAssetsLoaded]);

    // Intro: plays as the splash curtain lifts.
    useGSAP(
        () => {
            if (!introStarted) return;
            const mm = gsap.matchMedia();

            mm.add({ ok: MOTION_OK, reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
                if (ctx.conditions.reduce) {
                    Object.assign(motion.current, { intro: 1, props: 1 });
                    return;
                }

                const split = SplitText.create(titleRef.current, {
                    type: 'lines',
                    mask: 'lines',
                    linesClass: 'split-line',
                });

                // The splash curtain lifts upwards over ~1s (expo.inOut), so it
                // uncovers the bottom of the screen first and the headline last
                // (~0.58s). Each element starts as the curtain clears it, so its
                // entrance is actually seen rather than played behind the curtain.
                const tl = gsap.timeline({ onComplete: () => split.revert() })
                    .to(motion.current, { intro: 1, duration: 2.8, ease: EASE.reveal }, 0)
                    .from('[data-hero="cta"]', { y: 30, autoAlpha: 0, duration: 1.1, ease: EASE.reveal }, 0.3)
                    .to(motion.current, { props: 1, duration: 1.6, ease: 'none' }, 0.45)
                    .from('[data-hero="greeting"]', { yPercent: 70, autoAlpha: 0, duration: 1.2, ease: EASE.reveal }, 0.55)
                    .from(split.lines, { yPercent: 110, duration: 1.3, ease: EASE.reveal, stagger: 0.1 }, 0.62);

                // Static fallback (no WebGL): the poster gets the same settle-in.
                const poster = sectionRef.current.querySelector('[data-hero="poster"]');
                if (poster) tl.from(poster, { scale: 1.08, autoAlpha: 0, duration: 2.2, ease: EASE.reveal }, 0);
            });
        },
        { dependencies: [introStarted], scope: sectionRef },
    );

    // Exit: scrubbed to scroll. Animates the outer wrappers so it never fights
    // the intro tweens on the inner elements.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                const trigger = sectionRef.current;

                ScrollTrigger.create({
                    trigger,
                    start: 'top top',
                    end: 'bottom top',
                    onUpdate: (self) => {
                        motion.current.exit = self.progress;
                    },
                });

                gsap.to(textRef.current, {
                    yPercent: -40,
                    autoAlpha: 0,
                    ease: 'none',
                    scrollTrigger: { trigger, start: 'top top', end: '55% top', scrub: true },
                });
                // Static fallback: echo the 3D camera pulling back.
                const poster = trigger.querySelector('[data-hero="poster-frame"]');
                if (poster) {
                    gsap.to(poster, {
                        scale: 0.9,
                        yPercent: 8,
                        ease: 'none',
                        scrollTrigger: { trigger, start: 'top top', end: 'bottom top', scrub: true },
                    });
                }

                gsap.to(ctaRef.current, {
                    autoAlpha: 0,
                    y: -24,
                    ease: 'none',
                    scrollTrigger: { trigger, start: '5% top', end: '35% top', scrub: true },
                });
            });
        },
        { scope: sectionRef },
    );

    return (
        <section id="home" ref={sectionRef} className="min-h-screen w-full flex flex-col relative">
            <div
                ref={textRef}
                className="w-full mx-auto flex flex-col sm:mt-36 mt-20 c-space gap-3 relative z-10 pointer-events-none">
                <p
                    data-hero="greeting"
                    className="sm:text-3xl text-2xl font-medium text-white text-center font-generalsans">
                    Hi, I am Anoop <span className="waving-hand">👋</span>
                </p>
                <h1 ref={titleRef} className="hero_tag text-gray_gradient">
                    Building Projects &amp; Learning
                </h1>
            </div>

            <SceneCanvas
                eager
                className="w-full h-full absolute inset-0 overflow-hidden"
                staticFallback={<HeroPoster />}
                onUnavailable={onAssetsLoaded}>
                <Suspense fallback={<CanvasLoader />}>
                    <PerspectiveCamera makeDefault position={[0, 0, 20]} />
                    <HeroCamera isMobile={isMobile} motion={motion}>
                        <HackerRoom scale={sizes.deskScale} position={sizes.deskPosition} rotation={[0, Math.PI, 0]} />
                    </HeroCamera>

                    <group>
                        <PopIn motion={motion} delay={0} position={sizes.reactLogoPosition}>
                            <ReactLogo position={[0, 0, 0]} />
                        </PopIn>
                        <PopIn motion={motion} delay={0.18} position={sizes.cubePosition}>
                            <Cube position={[0, 0, 0]} />
                        </PopIn>
                        <PopIn motion={motion} delay={0.36} position={sizes.ringPosition}>
                            <Rings position={[0, 0, 0]} />
                        </PopIn>
                    </group>

                    <ambientLight intensity={1} />
                    <directionalLight position={[10, 10, 10]} intensity={0.5} />

                    <SceneReady onReady={onAssetsLoaded} />
                </Suspense>
            </SceneCanvas>

            <div ref={ctaRef} className="absolute bottom-7 left-0 right-0 w-full z-10 c-space">
                <div data-hero="cta" className="hero-meta">
                    <p className="hero-meta__item">
                        <span className="hero-meta__label">Focus</span>
                        Full-stack &amp; AI-driven systems
                    </p>
                    <Button
                        href="#contact"
                        onClick={handleAnchorClick}
                        name="Let's work together"
                        isBeam
                        variant="primary"
                        containerClass="sm:w-fit w-full"
                    />
                    <p className="hero-meta__item hero-meta__item--end">
                        <span className="hero-meta__label">Based in</span>
                        Dehradun, India
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
