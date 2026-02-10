import React, { useState } from 'react';
import SplashScreen from './Sections/SplashScreen.jsx';
import NavBar from "./Sections/NavBar.jsx";
import Hero from './Sections/Hero.jsx';
import About from "./Sections/About.jsx";
import Certificates from "./Sections/Certificates.jsx";
import Contact from "./Sections/Contact.jsx";
import Footer from "./Sections/Footer.jsx";
import Projects from "./Sections/Projects.jsx";

const App = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    const handleSplashComplete = () => {
        // Only hide splash if assets are loaded
        if (assetsLoaded) {
            setShowSplash(false);
        }
    };

    const handleAssetsLoaded = () => {
        setAssetsLoaded(true);
    };

    return (
        <>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} assetsLoaded={assetsLoaded} />}

            <main className="max-w-7xl mx-auto">
                <NavBar />
                <Hero onAssetsLoaded={handleAssetsLoaded} />
                <About />
                <Projects />
                <Certificates />
                <Contact />
                <Footer />
            </main>
        </>
    );
};

export default App;