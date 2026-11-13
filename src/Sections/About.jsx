import { lazy, Suspense, useRef, useState } from 'react';
import Button from '../components/Button.jsx';
import SceneCanvas from '../components/SceneCanvas.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import TechStack from '../components/TechOrbit.jsx';
import useReveal from '../hooks/useReveal.js';
import { EMAIL } from '../constants/index.js';
import { gsap, ScrollTrigger, useGSAP, EASE, MOTION_OK } from '../lib/gsap.js';
import { handleAnchorClick } from '../lib/scroll.js';

const Globe = lazy(() => import('../components/Globe.jsx'));

const About = () => {
    const sectionRef = useRef(null);
    const [hasCopied, setHasCopied] = useState(false);

    useReveal(sectionRef);

    // Bento cards rise in as a batch, row by row. Each card's artwork settles
    // from a slight zoom a beat behind its card, which gives the grid depth.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                const cards = gsap.utils.toArray('[data-card]', sectionRef.current);
                gsap.set(cards, { y: 70, autoAlpha: 0 });
                gsap.set('[data-card-media]', { scale: 1.12, autoAlpha: 0 });

                ScrollTrigger.batch(cards, {
                    start: 'top 88%',
                    once: true,
                    onEnter: (batch) => {
                        gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.3, ease: EASE.reveal, stagger: 0.12 });
                        gsap.to(
                            batch.map((card) => card.querySelector('[data-card-media]')).filter(Boolean),
                            { scale: 1, autoAlpha: 1, duration: 1.6, ease: EASE.reveal, stagger: 0.12, delay: 0.15 },
                        );
                    },
                });
            });
        },
        { scope: sectionRef },
    );

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${EMAIL}`;
        }
    };

    return (
        <section id="about" ref={sectionRef} className="section">
            <div className="c-space">
                <SectionHeading
                    index="01"
                    label="About"
                    title="Performance, scalability and clean system design."
                />

                <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
                    <div data-card className="col-span-1 xl:row-span-3">
                        <div className="grid-container">
                            <div className="card-media sm:h-[276px]">
                                <img
                                    data-card-media
                                    src="/assets/grid1.webp"
                                    alt=""
                                    width="816"
                                    height="672"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="grid-headtext">Hi, I&apos;m Anoop</h3>
                                <p className="grid-subtext">
                                    A Computer Science undergraduate with hands-on experience in building full-stack and
                                    AI-driven systems. I have developed solutions spanning machine learning, backend
                                    APIs, and interactive web interfaces, with a strong focus on performance,
                                    scalability, and clean system design.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div data-card className="col-span-1 xl:row-span-3">
                        <div className="grid-container">
                            <TechStack />
                        </div>
                    </div>

                    <div data-card className="col-span-1 xl:row-span-4">
                        <div className="grid-container">
                            <div data-card-media className="globe-frame rounded-3xl w-full h-[326px]">
                                <SceneCanvas
                                    className="globe-canvas"
                                    // Same camera and renderer as react-globe.gl: fov 50, 2.5
                                    // globe radii above the surface, and no tone mapping (flat).
                                    camera={{ position: [0, 0, 3.5], fov: 50 }}
                                    gl={{ alpha: true, antialias: true }}
                                    flat
                                    fallback={<div className="globe-placeholder" />}
                                    staticFallback={
                                        <img
                                            src="/assets/fallback/globe.webp"
                                            alt="Globe with a marker on Dehradun, India"
                                            width="326"
                                            height="326"
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                        />
                                    }>
                                    <Suspense fallback={null}>
                                        <Globe />
                                    </Suspense>
                                </SceneCanvas>
                            </div>
                            <div>
                                <h3 className="grid-headtext">I’m very flexible with time zone communications & locations</h3>
                                <p className="grid-subtext">
                                    Based in Dehradun, Uttarakhand, with availability for remote work across global time
                                    zones.
                                </p>
                                <Button
                                    href="#contact"
                                    onClick={handleAnchorClick}
                                    name="Contact Me"
                                    isBeam
                                    containerClass="w-full mt-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div data-card className="xl:col-span-2 xl:row-span-3">
                        <div className="grid-container">
                            <div className="card-media sm:h-[276px]">
                                <img
                                    data-card-media
                                    src="/assets/grid3.webp"
                                    alt=""
                                    width="1608"
                                    height="648"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="grid-headtext">My passion for Coding</h3>
                                <p className="grid-subtext">
                                    I love solving problems and building things with code. Coding isn&apos;t just my
                                    profession, it is my passion
                                </p>
                            </div>
                        </div>
                    </div>

                    <div data-card className="col-span-1 xl:row-span-2">
                        <div className="grid-container">
                            <div className="card-media sm:h-[126px]">
                                <img
                                    data-card-media
                                    src="/assets/grid4.webp"
                                    alt=""
                                    width="720"
                                    height="544"
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover sm:object-top"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="grid-subtext text-center">Contact me</p>
                                <button type="button" className="copy-container group w-full" onClick={handleCopy}>
                                    <img
                                        src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'}
                                        alt=""
                                        width="24"
                                        height="24"
                                    />
                                    <span className="lg:text-2xl md:text-xl font-medium text-gray_gradient">{EMAIL}</span>
                                </button>
                                <p className="copy-status" aria-live="polite">
                                    {hasCopied ? 'Copied to clipboard' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
