import { useRef } from 'react';
import useReveal from '../hooks/useReveal.js';
import { EMAIL, LOCATION, navLinks, socials } from '../constants/index.js';
import { handleAnchorClick } from '../lib/scroll.js';

const Footer = () => {
    const ref = useRef(null);
    useReveal(ref);

    return (
        <footer ref={ref} className="max-w-7xl mx-auto c-space">
            <div data-reveal="stagger" data-start="top 98%" className="footer-top">
                <div className="flex flex-col gap-4 max-w-sm">
                    <a href="#home" onClick={handleAnchorClick} className="brand">
                        <img src="/favicon.svg" alt="" width="28" height="28" className="brand__mark" />
                        <span>Anoop</span>
                    </a>
                    <p className="text-white-600 leading-relaxed">
                        Computer Science undergraduate building full-stack and AI-driven systems.
                    </p>
                    <a href={`mailto:${EMAIL}`} className="contact-link w-fit">
                        {EMAIL}
                    </a>
                </div>

                <nav aria-label="Footer" className="footer-col">
                    <p className="footer-col__title">Sitemap</p>
                    <ul>
                        {navLinks.map(({ id, name, href }) => (
                            <li key={id}>
                                <a href={href} onClick={handleAnchorClick} className="footer-link">
                                    {name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="footer-col">
                    <p className="footer-col__title">Elsewhere</p>
                    <ul>
                        {socials.map(({ label, href, icon }) => (
                            <li key={label}>
                                <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link">
                                    <img src={icon} alt="" width="16" height="16" className="opacity-70" />
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Anoop. All rights reserved.</p>
                <p>
                    {LOCATION}
                </p>
                <a href="#home" onClick={handleAnchorClick} className="footer-link">
                    Back to top <span aria-hidden="true">↑</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
