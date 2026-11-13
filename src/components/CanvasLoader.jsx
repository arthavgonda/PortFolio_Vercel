import { Html } from '@react-three/drei';

// Suspense fallback shown inside a canvas while its models/textures stream in.
// Deliberately not subscribed to drei's useProgress: loaders report progress
// synchronously during render, which made React warn about a setState inside
// another component's render. The splash screen shows real progress instead.
const CanvasLoader = () => (
    <Html center>
        <div className="flex flex-col items-center gap-3 text-white-600 text-sm whitespace-nowrap" role="status">
            <span className="canvas-loader" aria-hidden="true" />
            <span>Loading…</span>
        </div>
    </Html>
);

export default CanvasLoader;
