// Single place where GSAP plugins are registered. Import gsap from here so the
// plugins are guaranteed to be registered before any component uses them.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// One motion vocabulary for the whole site. Reveals decelerate hard (expo.out)
// so things arrive quickly and settle softly; swaps use a symmetric curve.
export const EASE = {
    reveal: 'expo.out',
    swapOut: 'power2.in',
    swapIn: 'power3.out',
    curtain: 'expo.inOut',
};

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger, SplitText, useGSAP };
