import { useState } from 'react';
import { techStack } from '../constants/index.js';

const allTech = [...techStack.inner, ...techStack.outer];

/*
 * Two counter-rotating orbits of the tools used in the projects. Pure CSS:
 * each ring spins, and each tile spins the other way at the same rate so the
 * icons stay upright. Pauses under prefers-reduced-motion (see index.css).
 *
 * Names live in the chip list under the card text, not in floating labels: a
 * label on a moving tile has nowhere safe to sit (it collided with the core and
 * neighbouring tiles, and was clipped at the card edges). Hovering a tile
 * highlights its chip and vice versa, and either one pauses the orbit.
 */
const Ring = ({ items, radius, duration, reverse = false, active, onActive }) => (
    <div
        className={`orbit-ring ${reverse ? 'orbit-ring--reverse' : ''}`}
        style={{ '--radius': `${radius}px`, '--duration': `${duration}s` }}>
        {items.map((tech, i) => (
            <div
                key={tech.name}
                className="orbit-slot"
                style={{ '--angle': `${(360 / items.length) * i + (reverse ? 18 : 0)}deg` }}>
                <div
                    className="orbit-tile"
                    data-active={active === tech.name}
                    onPointerEnter={() => onActive(tech.name)}
                    onPointerLeave={() => onActive(null)}>
                    <img
                        src={tech.icon}
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                        className={tech.invert ? 'invert' : undefined}
                    />
                </div>
            </div>
        ))}
    </div>
);

const TechStack = () => {
    const [active, setActive] = useState(null);

    return (
        <>
            <div data-card-media className="card-media h-[276px]">
                <div className="tech-orbit" data-focus={active ? 'true' : undefined} aria-hidden="true">
                    <div className="tech-orbit__stage">
                        <div className="orbit-core">A</div>
                        <Ring items={techStack.outer} radius={114} duration={70} reverse active={active} onActive={setActive} />
                        <Ring items={techStack.inner} radius={64} duration={45} active={active} onActive={setActive} />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="grid-headtext">Tech Stack</h3>
                <p className="grid-subtext">
                    I specialise in building scalable software systems and data-driven applications, with experience
                    across backend development, machine learning pipelines, and performance-focused system design.
                </p>
                <ul className="tech-chips" aria-label="Tools I work with">
                    {allTech.map((tech) => (
                        <li
                            key={tech.name}
                            data-active={active === tech.name}
                            onPointerEnter={() => setActive(tech.name)}
                            onPointerLeave={() => setActive(null)}>
                            {tech.name}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default TechStack;
