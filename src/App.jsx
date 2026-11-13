import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger } from './lib/gsap.js';
import { initSmoothScroll, setScrollLocked, scrollToTarget } from './lib/scroll.js';
import { hasWebGL } from './lib/webgl.js';
import SplashScreen from './Sections/SplashScreen.jsx';
import NavBar from './Sections/NavBar.jsx';
import Hero from './Sections/Hero.jsx';
import About from './Sections/About.jsx';
import Experience from './Sections/Experience.jsx';
import Projects from './Sections/Projects.jsx';
import Certificates from './Sections/Certificates.jsx';
import Contact from './Sections/Contact.jsx';
import Footer from './Sections/Footer.jsx';

// 3D scenes below the fold are split into their own chunks. Once the intro has
// played, fetch them in idle time so they're ready before the visitor arrives.
const prefetchScenes = () => {
    import('./components/Globe.jsx');
    import('./components/ExperienceScene.jsx');
    import('./components/DemoComputer.jsx');
    import('./components/CertificatesScene.jsx');
};

const App = () => {
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [introStarted, setIntroStarted] = useState(false);
    const [splashDone, setSplashDone] = useState(false);

    useEffect(() => {
        // The intro is choreographed from the top of the page.
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
        return initSmoothScroll();
    }, []);

    useEffect(() => {
        setScrollLocked(!splashDone);
        if (!splashDone) return;

        ScrollTrigger.refresh();
        if (window.location.hash) scrollToTarget(window.location.hash);

        if (hasWebGL()) {
            const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1200));
            idle(prefetchScenes);
        }
    }, [splashDone]);

    const handleAssetsLoaded = useCallback(() => setAssetsLoaded(true), []);
    const handleExitStart = useCallback(() => setIntroStarted(true), []);
    const handleSplashDone = useCallback(() => setSplashDone(true), []);

    return (
        <>
            {!splashDone && (
                <SplashScreen ready={assetsLoaded} onExitStart={handleExitStart} onComplete={handleSplashDone} />
            )}

            <NavBar ready={introStarted} />
            <main className="max-w-7xl mx-auto">
                <Hero onAssetsLoaded={handleAssetsLoaded} introStarted={introStarted} />
                <About />
                <Experience />
                <Projects />
                <Certificates />
                <Contact />
            </main>
            <Footer />
        </>
    );
};

export default App;
