import { Component, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import useInView from '../hooks/useInView.js';
import { hasWebGL } from '../lib/webgl.js';
import { VisibleContext } from './sceneVisibility.js';

// Safety net for when the probe in lib/webgl.js passes but the real context
// still fails (GPU process crash, context limit). One broken scene shows its
// static fallback; the rest of the page carries on.
class CanvasBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error) {
        console.warn('3D scene unavailable, showing static fallback:', error.message);
        this.props.onUnavailable?.();
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}

/*
 * A <Canvas> that costs nothing until it's needed:
 *  - it isn't created (no WebGL context, no asset downloads) until the
 *    wrapper comes within `mountMargin` of the viewport;
 *  - once created, it only renders continuously while visible. Off screen it
 *    drops to on-demand rendering, so four canvases never compete for the GPU;
 *  - without WebGL (or if the canvas crashes) it renders `staticFallback`.
 */
const SceneCanvas = ({
    className,
    mountMargin = '600px',
    eager = false,
    fallback = null,
    staticFallback = null,
    onUnavailable,
    children,
    ...canvasProps
}) => {
    const ref = useRef(null);
    const near = useInView(ref, { rootMargin: mountMargin, once: true });
    const visible = useInView(ref);
    const mounted = eager || near;

    let content = fallback;
    if (!hasWebGL()) content = staticFallback;
    else if (mounted)
        content = (
            <CanvasBoundary fallback={staticFallback} onUnavailable={onUnavailable}>
                <Canvas frameloop={visible ? 'always' : 'demand'} {...canvasProps}>
                    <VisibleContext.Provider value={visible}>{children}</VisibleContext.Provider>
                </Canvas>
            </CanvasBoundary>
        );

    return (
        <div ref={ref} className={className}>
            {content}
        </div>
    );
};

export default SceneCanvas;
