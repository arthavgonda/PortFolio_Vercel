import { Fragment, lazy, Suspense, useRef } from 'react';
import { experience } from '../constants/index.js';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap.js';
import { hasWebGL } from '../lib/webgl.js';
import { TODAY, activeSpan, timeAt } from '../lib/timeline.js';
import useReveal from '../hooks/useReveal.js';
import SceneCanvas from '../components/SceneCanvas.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const ExperienceScene = lazy(() => import('../components/ExperienceScene.jsx'));

// "**text**" in the data becomes <strong>, mirroring the emphasis on the résumé.
const withEmphasis = (text) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
    );

const Experience = () => {
    const sectionRef = useRef(null);
    const listRef = useRef(null);
    const visualRef = useRef(null);
    const readoutRef = useRef(null);
    // Months from the start of the tape. Written by scroll, read by the 3D
    // scene every frame, so scrolling never re-renders React.
    const time = useRef({ target: TODAY });
    const webgl = hasWebGL();

    useReveal(sectionRef);

    useGSAP(
        () => {
            if (!webgl) return;
            const items = gsap.utils.toArray('.xp-item', listRef.current);
            // `markCurrent`: light the entry under the playhead. Only meaningful
            // when the tape sits beside the list (desktop).
            const scrub = (markCurrent) => {
                const update = (self) => {
                    const t = timeAt(self.progress);
                    time.current.target = t;
                    if (!markCurrent) return;
                    const active = activeSpan(t);
                    items.forEach((el, i) => el.toggleAttribute('data-current', i === active));
                };
                return { onUpdate: update, onRefresh: update };
            };

            const mm = gsap.matchMedia();
            // Desktop: the tape is sticky beside the list, and each role swings
            // to the playhead as its entry crosses the middle of the screen.
            mm.add('(min-width: 1024px)', () => {
                ScrollTrigger.create({ trigger: listRef.current, start: 'top 60%', end: 'bottom 40%', ...scrub(true) });
                return () => items.forEach((el) => el.removeAttribute('data-current'));
            });
            // Phones: the tape sits above the list and rewinds as it scrolls past.
            mm.add('(max-width: 1023px)', () => {
                ScrollTrigger.create({ trigger: visualRef.current, start: 'top 85%', end: 'bottom 15%', ...scrub(false) });
            });
        },
        { scope: sectionRef },
    );

    return (
        <section id="experience" ref={sectionRef} className="section c-space">
            <SectionHeading index="02" label="Career" title="Experience" />

            <div className={`xp-layout ${webgl ? 'xp-layout--visual' : ''}`}>
                {webgl && (
                    <div className="xp-visual" ref={visualRef} aria-hidden="true">
                        <div className="xp-visual__stage">
                            <SceneCanvas
                                className="xp-canvas"
                                camera={{ position: [0, 0.9, 7.4], fov: 30 }}
                                gl={{ antialias: true }}>
                                <Suspense fallback={null}>
                                    <ExperienceScene time={time} readout={readoutRef} />
                                </Suspense>
                            </SceneCanvas>
                            <p className="xp-readout">
                                <span className="xp-readout__label">Timeline</span>
                                <span ref={readoutRef} className="xp-readout__value" />
                            </p>
                        </div>
                    </div>
                )}

                <ol ref={listRef} className="xp-list">
                    {experience.map(({ company, team, role, period, location, points, tags }) => (
                        <li key={company} className="xp-item">
                            <div data-reveal="up" className="xp-card">
                                <p className="xp-meta">
                                    <span className="xp-period">{period}</span>
                                    <span className="xp-location">{location}</span>
                                </p>
                                <h3 className="xp-company">
                                    {company}
                                    {team && <span className="xp-team">{team}</span>}
                                </h3>
                                <p className="xp-role">{role}</p>

                                <ul className="xp-points">
                                    {points.map((point) => (
                                        <li key={point}>{withEmphasis(point)}</li>
                                    ))}
                                </ul>

                                <ul className="tech-chips" aria-label="Tools used">
                                    {tags.map((tag) => (
                                        <li key={tag}>{tag}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default Experience;
