import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';

/*
 * Camera choreography for the hero. `motion` is a ref of 0→1 values written by
 * GSAP in Hero.jsx:
 *   intro — dollies in from far away as the splash lifts
 *   exit  — scroll progress through the hero: the camera rises and pulls back,
 *           so the room recedes more slowly than the page (depth parallax)
 * Reading a ref every frame, instead of passing props, keeps scrolling free of
 * React re-renders.
 */
const HeroCamera = ({ isMobile, motion, children }) => {
    const group = useRef();

    useFrame((state, delta) => {
        const { intro, exit } = motion.current;
        const away = 1 - intro;

        easing.damp3(state.camera.position, [0, away * 3 + exit * 2.5, 20 + away * 16 + exit * 9], 0.25, delta);

        const px = isMobile ? 0 : state.pointer.x;
        const py = isMobile ? 0 : state.pointer.y;
        easing.dampE(group.current.rotation, [-py / 3 + exit * 0.2, px / 5, 0], 0.25, delta);
    });

    return <group ref={group}>{children}</group>;
};

export default HeroCamera;
