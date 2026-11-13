import { lazy, Suspense, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { hasWebGL } from '../lib/webgl.js';
import { certificateImages } from '../constants/index.js';
import useReveal from '../hooks/useReveal.js';
import SceneCanvas from '../components/SceneCanvas.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const CertificatesScene = lazy(() => import('../components/CertificatesScene.jsx'));

const CertificateGrid = ({ compact = false, className = '', ...props }) => (
    <ul className={`cert-grid ${compact ? 'cert-grid--compact' : ''} ${className}`} {...props}>
        {certificateImages.map((src, i) => (
            <li key={src}>
                <img src={src} alt={`Certificate ${i + 1}`} loading="lazy" decoding="async" />
            </li>
        ))}
    </ul>
);

const Certificates = () => {
    const sectionRef = useRef(null);
    const barRef = useRef(null);
    const progress = useRef(0);
    const webgl = hasWebGL();

    useReveal(sectionRef);

    // Scroll position through the tall section drives the carousel. It goes
    // into a ref (read by the 3D scene each frame), not React state: the old
    // version re-rendered the whole Canvas tree on every scroll event.
    useGSAP(
        () => {
            if (!webgl) return;
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    progress.current = self.progress;
                    gsap.set(barRef.current, { scaleX: self.progress });
                },
            });
        },
        { scope: sectionRef },
    );

    // Without WebGL the scroll-driven carousel can't exist, and 400vh of empty
    // scrolling would be worse than nothing: show a plain grid instead.
    if (!webgl) {
        return (
            <section id="certificates" ref={sectionRef} className="section c-space">
                <SectionHeading index="04" label="Recognition" title="Certificates" />
                <CertificateGrid data-reveal="stagger" />
            </section>
        );
    }

    return (
        <section id="certificates" ref={sectionRef} className="c-space my-20" style={{ minHeight: '400vh' }}>
            <div className="sticky top-0 w-full h-screen">
                {/* The canvas fills the whole viewport, as in the original, so the
                    ring renders at its original size. Heading and progress sit on
                    top of it, with the heading pushed below the fixed navbar. */}
                <SceneCanvas
                    className="absolute inset-0"
                    camera={{ position: [0, 0, 100], fov: 15 }}
                    fallback={<div className="w-full h-full" />}
                    staticFallback={<CertificateGrid compact />}>
                    <Suspense fallback={null}>
                        <CertificatesScene progress={progress} />
                    </Suspense>
                </SceneCanvas>

                <div className="relative z-10 pt-24 sm:pt-28 pointer-events-none">
                    <SectionHeading index="04" label="Recognition" title="Certificates" trigger="#certificates" />
                </div>

                <div
                    data-reveal="up"
                    data-trigger="#certificates"
                    data-delay="0.3"
                    className="cert-progress absolute bottom-8 left-0 z-10">
                    <span>Scroll</span>
                    <span className="cert-progress__track">
                        <span ref={barRef} className="cert-progress__bar" />
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Certificates;
