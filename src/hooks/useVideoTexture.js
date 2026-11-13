import { useEffect, useState } from 'react';
import * as THREE from 'three';

/*
 * Plain-MP4 video textures without drei's useVideoTexture, which statically
 * imports hls.js (~500 KB) even when no HLS stream is ever played.
 *
 * Textures are cached per src, so flipping back to a project is instant, and
 * the hook never suspends: while the next video buffers, the current one stays
 * on screen and is swapped only once the new one has a frame to show.
 */
const cache = new Map();

function getEntry(src) {
    let entry = cache.get(src);
    if (entry) return entry;

    const video = document.createElement('video');
    Object.assign(video, { src, crossOrigin: 'anonymous', loop: true, muted: true, playsInline: true, preload: 'auto' });
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false; // glTF UV convention

    const ready = new Promise((resolve) => {
        if (video.readyState >= 2) resolve();
        else video.addEventListener('loadeddata', resolve, { once: true });
    });

    entry = { video, texture, ready };
    cache.set(src, entry);
    video.load();
    return entry;
}

// Start buffering a video before it's needed (e.g. on arrow-button hover).
export const prefetchVideo = (src) => void getEntry(src);

export default function useVideoTexture(src, playing = true) {
    const [entry, setEntry] = useState(() => getEntry(src));

    useEffect(() => {
        const next = getEntry(src);
        let cancelled = false;
        next.ready.then(() => !cancelled && setEntry(next));
        return () => {
            cancelled = true;
        };
    }, [src]);

    useEffect(() => {
        cache.forEach((e) => e !== entry && e.video.pause());
        if (playing) entry.video.play().catch(() => {});
        else entry.video.pause();
    }, [entry, playing]);

    return entry.texture;
}
