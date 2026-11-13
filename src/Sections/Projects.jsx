import { lazy, Suspense, useRef, useState } from 'react';
import { Center, OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';

import { myProjects } from '../constants/index.js';
import { gsap, useGSAP, EASE } from '../lib/gsap.js';
import { prefersReducedMotion } from '../lib/scroll.js';
import useReveal from '../hooks/useReveal.js';
import { prefetchVideo } from '../hooks/useVideoTexture.js';
import SceneCanvas from '../components/SceneCanvas.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CanvasLoader from '../components/CanvasLoader.jsx';

const DemoComputer = lazy(() => import('../components/DemoComputer.jsx'));

const projectCount = myProjects.length;
const pad = (n) => String(n).padStart(2, '0');

const Projects = () => {
    const sectionRef = useRef(null);
    const panelRef = useRef(null);
    const [index, setIndex] = useState(0);

    // Transition bookkeeping lives in refs: it must survive the re-render
    // between the "out" and "in" halves without causing extra renders.
    const busy = useRef(false);
    const direction = useRef(1);
    const fromHeight = useRef(0);
    const shownIndex = useRef(0);

    // Dragging the model on a phone would trap vertical scrolling.
    const isTouch = useMediaQuery({ query: '(pointer: coarse)' });

    useReveal(sectionRef);

    const go = (dir) => {
        if (busy.current) return;
        const next = (index + dir + projectCount) % projectCount;
        direction.current = dir;

        if (prefersReducedMotion()) {
            setIndex(next);
            return;
        }

        busy.current = true;
        fromHeight.current = panelRef.current.offsetHeight;
        gsap.to(panelRef.current.querySelectorAll('[data-swap]'), {
            x: -36 * dir,
            autoAlpha: 0,
            duration: 0.32,
            ease: EASE.swapOut,
            stagger: 0.03,
            onComplete: () => setIndex(next),
        });
    };

    // Incoming half: new content slides in from the side the visitor is moving
    // towards, while the panel eases to its new height instead of jumping.
    useGSAP(
        () => {
            if (shownIndex.current === index) return;
            shownIndex.current = index;
            if (prefersReducedMotion()) return;

            const dir = direction.current;
            gsap.fromTo(
                panelRef.current,
                { height: fromHeight.current },
                { height: 'auto', duration: 0.6, ease: EASE.swapIn, clearProps: 'height' },
            );
            gsap.fromTo(
                panelRef.current.querySelectorAll('[data-swap]'),
                { x: 36 * dir, autoAlpha: 0 },
                {
                    x: 0,
                    autoAlpha: 1,
                    duration: 0.75,
                    ease: EASE.swapIn,
                    stagger: 0.05,
                    onComplete: () => {
                        busy.current = false;
                    },
                },
            );
        },
        { dependencies: [index], scope: panelRef },
    );

    const neighbour = (dir) => myProjects[(index + dir + projectCount) % projectCount];
    const currentProject = myProjects[index];

    return (
        <section className="section c-space" id="projects" ref={sectionRef}>
            <SectionHeading index="03" label="Work" title="Selected work" />

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 w-full">
                <div data-reveal="up">
                    <div
                        ref={panelRef}
                        className="project-panel flex flex-col gap-5 relative sm:p-10 py-10 px-5 shadow-2xl shadow-black-200">
                        {/* Spotlights render at the original artwork's 1038px width and
                            spill left past the panel; that spill is the soft glow. */}
                        <div className="absolute top-0 right-0 pointer-events-none" aria-hidden="true">
                            {myProjects.map((project, i) => (
                                <img
                                    key={project.spotlight}
                                    src={project.spotlight}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="spotlight"
                                    data-active={i === index}
                                />
                            ))}
                        </div>

                        <div
                            data-swap
                            className="p-3 backdrop-filter backdrop-blur-3xl w-fit rounded-lg relative"
                            style={currentProject.logoStyle}>
                            <img className="w-10 h-10 shadow-sm" src={currentProject.logo} alt="" width="40" height="40" />
                        </div>

                        <div className="flex flex-col gap-5 text-white-600 my-5 relative">
                            <h3 data-swap className="text-white text-2xl font-semibold" aria-live="polite">
                                {currentProject.title}
                            </h3>
                            <p data-swap>{currentProject.desc}</p>
                            <p data-swap>{currentProject.subdesc}</p>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-5 relative">
                            <ul data-swap className="flex items-center gap-3" aria-label="Built with">
                                {currentProject.tags.map((tag) => (
                                    <li key={tag.id} className="tech-logo" title={tag.name}>
                                        <img src={tag.path} alt={tag.name} className={tag.invert ? 'invert' : undefined} />
                                    </li>
                                ))}
                            </ul>

                            <a
                                data-swap
                                className="link-arrow flex items-center gap-2 cursor-pointer text-white-600"
                                href={currentProject.href}
                                target="_blank"
                                rel="noreferrer">
                                <span>View on GitHub</span>
                                <img src="/assets/arrow-up.png" alt="" className="w-3 h-3" />
                            </a>
                        </div>

                        <div className="flex justify-between items-center mt-7 relative">
                            <button
                                type="button"
                                className="arrow-btn"
                                onClick={() => go(-1)}
                                onPointerEnter={() => prefetchVideo(neighbour(-1).texture)}
                                onFocus={() => prefetchVideo(neighbour(-1).texture)}
                                aria-label="Previous project">
                                <img src="/assets/left-arrow.png" alt="" />
                            </button>

                            <p className="text-sm text-white-500 tabular-nums tracking-widest">
                                <span data-swap className="inline-block text-white">
                                    {pad(index + 1)}
                                </span>{' '}
                                / {pad(projectCount)}
                            </p>

                            <button
                                type="button"
                                className="arrow-btn"
                                onClick={() => go(1)}
                                onPointerEnter={() => prefetchVideo(neighbour(1).texture)}
                                onFocus={() => prefetchVideo(neighbour(1).texture)}
                                aria-label="Next project">
                                <img src="/assets/right-arrow.png" alt="" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div data-reveal="up" data-delay="0.12" className="h-96 md:h-full">
                    <SceneCanvas
                        className="border border-black-300 bg-black-200 rounded-2xl overflow-hidden h-full min-h-96"
                        fallback={<div className="w-full h-full" />}
                        staticFallback={
                            <video
                                key={currentProject.texture}
                                src={currentProject.texture}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        }>
                        <ambientLight intensity={Math.PI} />
                        <directionalLight position={[10, 10, 5]} />
                        <Center>
                            <Suspense fallback={<CanvasLoader />}>
                                <group scale={2} position={[0, -3, 0]} rotation={[0, -0.1, 0]}>
                                    <DemoComputer texture={currentProject.texture} />
                                </group>
                            </Suspense>
                        </Center>
                        {!isTouch && <OrbitControls maxPolarAngle={Math.PI / 2} enableZoom={false} />}
                    </SceneCanvas>
                </div>
            </div>
        </section>
    );
};

export default Projects;
