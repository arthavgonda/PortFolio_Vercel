import { useRef, useState } from 'react';
import { navLinks } from '../constants/index.js';
import { gsap, ScrollTrigger, useGSAP, EASE } from '../lib/gsap.js';
import { handleAnchorClick } from '../lib/scroll.js';

const NavItems = ({ active, onClick }) => (
    <ul className="nav-ul">
        {navLinks.map((item) => (
            <li key={item.id} className="nav-li">
                <a
                    href={item.href}
                    className="nav-li_a"
                    data-active={active === item.href}
                    aria-current={active === item.href ? 'true' : undefined}
                    onClick={(e) => {
                        handleAnchorClick(e);
                        onClick?.();
                    }}>
                    {item.name}
                </a>
            </li>
        ))}
    </ul>
);

const Navbar = ({ ready }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState('#home');
    const headerRef = useRef(null);
    const barRef = useRef(null);
    const sidebarRef = useRef(null);
    const openRef = useRef(false);
    openRef.current = isOpen;

    // Fade the bar in with the hero once the splash lifts.
    useGSAP(
        () => {
            if (!ready) return;
            gsap.from(barRef.current, { y: -20, autoAlpha: 0, duration: 1.1, ease: EASE.reveal, delay: 0.7 });
        },
        { dependencies: [ready] },
    );

    useGSAP(() => {
        // Hide on scroll down, reveal on scroll up: content gets the full screen
        // while reading, navigation is one flick away.
        const show = gsap
            .from(headerRef.current, { yPercent: -100, duration: 0.4, ease: 'power3.out', paused: true })
            .progress(1);

        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
                const atTop = self.scroll() < 120;
                headerRef.current.classList.toggle('is-scrolled', !atTop);
                if (atTop || self.direction === -1 || openRef.current) show.play();
                else show.reverse();
            },
        });

        // Active link follows whichever section crosses the middle of the screen.
        navLinks.forEach(({ href }) => {
            ScrollTrigger.create({
                trigger: href,
                start: 'top 50%',
                end: 'bottom 50%',
                onToggle: (self) => self.isActive && setActive(href),
            });
        });
    });

    useGSAP(
        () => {
            if (!isOpen) return;
            gsap.from(sidebarRef.current.querySelectorAll('.nav-li'), {
                y: 14,
                autoAlpha: 0,
                duration: 0.6,
                ease: EASE.reveal,
                stagger: 0.05,
                delay: 0.05,
            });
        },
        { dependencies: [isOpen] },
    );

    const closeMenu = () => setIsOpen(false);

    return (
        <header ref={headerRef} className="site-header fixed top-0 left-0 right-0 z-50">
            <div ref={barRef} className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center py-5 mx-auto c-space">
                    <a href="#home" onClick={handleAnchorClick} className="brand" aria-label="Anoop, back to top">
                        <img src="/favicon.svg" alt="" width="28" height="28" className="brand__mark" />
                        <span>Anoop</span>
                    </a>

                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        className="text-neutral-400 hover:text-white sm:hidden flex"
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}>
                        <img src={isOpen ? '/assets/close.svg' : '/assets/menu.svg'} alt="" className="w-6 h-6" />
                    </button>

                    <nav className="sm:flex hidden" aria-label="Primary">
                        <NavItems active={active} />
                    </nav>
                </div>
            </div>

            <div ref={sidebarRef} className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <nav className="p-5" aria-label="Mobile">
                    <NavItems active={active} onClick={closeMenu} />
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
