// Some visitors can't create a WebGL context at all: blocklisted or very old
// GPUs, broken drivers (e.g. a GPU driver updated without a reboot), or browsers
// with WebGL switched off. For them every <Canvas> throws, and without a guard
// that takes the whole page down. Probe once and let scenes swap in static
// fallbacks instead.
let supported;

export function hasWebGL() {
    if (supported !== undefined) return supported;
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        supported = Boolean(gl);
        // Give the probe's context back; browsers cap how many can exist.
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
        supported = false;
    }
    return supported;
}
