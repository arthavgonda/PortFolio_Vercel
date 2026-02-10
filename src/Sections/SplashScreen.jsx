import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete, assetsLoaded }) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        // Animation timer - marks when animation is done
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Only exit when both animation is complete AND assets are loaded
        if (animationComplete && assetsLoaded) {
            setIsAnimating(false);
            setTimeout(() => onComplete?.(), 800); // Match slide-up duration
        }
    }, [animationComplete, assetsLoaded, onComplete]);

    return (
        <div className={`splash-screen ${!isAnimating ? 'slide-up' : ''}`}>
            <h1 className="welcome-text">
                <span className="wel-text">Wel</span>
                <span className="come-text">come.</span>
            </h1>

            {/* Optional: Show loading indicator if assets are still loading after animation */}
            {animationComplete && !assetsLoaded && (
                <div className="loading-indicator">
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SplashScreen;