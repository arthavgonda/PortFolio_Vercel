import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import { easing } from 'maath';
import { gsap, EASE } from '../lib/gsap.js';
import { prefersReducedMotion } from '../lib/scroll.js';
import { useSceneVisible } from './sceneVisibility.js';

/*
 * Rebuilds the original react-globe.gl globe with the same recipe (Phong
 * surface lit by ambient + overhead directional light, terrain bump map, 10°
 * graticule, and three-globe's own atmosphere shader), without the package:
 * it shipped a second full copy of three.js (its WebGPU build), h3-js and d3,
 * and fetched its textures from unpkg.com at runtime.
 *
 * Added on top: a pin on Dehradun that the globe turns to face when it scrolls
 * into view, and drag-to-spin that no longer hijacks the page's scroll wheel.
 */

const HOME = { lat: 30.3165, lng: 78.0322 }; // Dehradun
const DEG = Math.PI / 180;
const ATMOSPHERE_ALTITUDE = 0.15; // react-globe.gl default

// Matches three's SphereGeometry UV layout (u = 0 at longitude -180°).
const toVec3 = (lat, lng, r = 1) => {
    const theta = (90 - lat) * DEG;
    const phi = (lng + 180) * DEG;
    return new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta)).multiplyScalar(r);
};

// Spin (about Y) that brings a longitude round to face the camera on +Z.
const FACE_HOME = -Math.atan2(-Math.cos((HOME.lng + 180) * DEG), Math.sin((HOME.lng + 180) * DEG));
// A slight northward tilt so the pin sits just above centre.
const TILT = HOME.lat * DEG * 0.6;
// Starts a bit over half a turn away, so the intro has somewhere to spin from.
const START_SPIN = FACE_HOME - Math.PI * 1.25;

// three-globe's atmosphere (GlowMesh): a back-faced shell 15% above the surface
// whose fragments inside the globe's silhouette are discarded. Shader adapted
// from three-globe (MIT, vasturiano/three-globe).
const atmosphereShader = {
    uniforms: {
        color: { value: new THREE.Color('lightskyblue') },
        coefficient: { value: 0.1 },
        power: { value: 3.5 },
        hollowRadius: { value: 1 },
    },
    vertexShader: /* glsl */ `
        uniform float hollowRadius;
        varying vec3 vVertexWorldPosition;
        varying vec3 vVertexNormal;
        varying float vCameraDistanceToObjCenter;
        varying float vVertexAngularDistanceToHollowRadius;
        void main() {
            vVertexNormal = normalize(normalMatrix * normal);
            vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            vec4 objCenterViewPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            vCameraDistanceToObjCenter = length(objCenterViewPosition);
            float edgeAngle = atan(hollowRadius / vCameraDistanceToObjCenter);
            float vertexAngle = acos(dot(normalize(modelViewMatrix * vec4(position, 1.0)), normalize(objCenterViewPosition)));
            vVertexAngularDistanceToHollowRadius = vertexAngle - edgeAngle;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
    fragmentShader: /* glsl */ `
        uniform vec3 color;
        uniform float coefficient;
        uniform float power;
        uniform float hollowRadius;
        varying vec3 vVertexNormal;
        varying vec3 vVertexWorldPosition;
        varying float vCameraDistanceToObjCenter;
        varying float vVertexAngularDistanceToHollowRadius;
        void main() {
            if (vCameraDistanceToObjCenter < hollowRadius) discard;
            if (vVertexAngularDistanceToHollowRadius < 0.0) discard;
            vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
            vec3 viewCameraToVertex = normalize((viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz);
            float intensity = pow(coefficient + dot(vVertexNormal, viewCameraToVertex), power);
            gl_FragColor = vec4(color, intensity);
        }`,
};

// d3's geoGraticule10, as react-globe.gl drew it: parallels and meridians every
// 10° up to ±80°, with the four 90° meridians running all the way to the poles.
function Graticule() {
    const geometry = useMemo(() => {
        const pts = [];
        const r = 1.001;
        const seg = (a, b) => pts.push(a, b);
        for (let lat = -80; lat <= 80; lat += 10) {
            for (let lng = -180; lng < 180; lng += 2) seg(toVec3(lat, lng, r), toVec3(lat, lng + 2, r));
        }
        for (let lng = -180; lng < 180; lng += 10) {
            const extent = lng % 90 === 0 ? 90 : 80;
            for (let lat = -extent; lat < extent; lat += 2) seg(toVec3(lat, lng, r), toVec3(lat + 2, lng, r));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
    }, []);
    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="lightgrey" transparent opacity={0.1} depthWrite={false} />
        </lineSegments>
    );
}

function Pin() {
    const ring = useRef();
    const label = useRef();
    const position = useMemo(() => toVec3(HOME.lat, HOME.lng, 1.004), []);
    const quaternion = useMemo(
        () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), position.clone().normalize()),
        [position],
    );
    const world = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        // Expanding sonar ring.
        const t = (state.clock.elapsedTime % 2) / 2;
        ring.current.scale.setScalar(1 + t * 3.5);
        ring.current.material.opacity = (1 - t) * 0.8;

        // Fade the label out as the pin rotates round to the far side.
        ring.current.getWorldPosition(world);
        const facing = world.normalize().dot(state.camera.position.clone().normalize());
        if (label.current) label.current.style.opacity = String(THREE.MathUtils.smoothstep(facing, 0.35, 0.7));
    });

    return (
        <group position={position} quaternion={quaternion}>
            <mesh>
                <circleGeometry args={[0.022, 24]} />
                <meshBasicMaterial color="#4ade80" toneMapped={false} />
            </mesh>
            <mesh ref={ring}>
                <ringGeometry args={[0.022, 0.03, 32]} />
                <meshBasicMaterial color="#4ade80" transparent depthWrite={false} toneMapped={false} />
            </mesh>
            <Html position={[0.06, 0.02, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
                <span ref={label} className="globe-label">I’m here</span>
            </Html>
        </group>
    );
}

export default function Globe() {
    const spin = useRef();
    const [map, bumpMap] = useTexture(['/textures/globe/earth-night.webp', '/textures/globe/earth-topology.webp']);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;

    const visible = useSceneVisible();
    const gl = useThree((s) => s.gl);
    // Rotation the globe eases toward; intro tween and dragging both write it.
    const target = useRef({ y: START_SPIN });
    const drag = useRef({ active: false, x: 0, idle: null });

    // First time the card is on screen: spin round and settle on Dehradun.
    const played = useRef(false);
    useEffect(() => {
        if (!visible || played.current) return;
        played.current = true;
        if (prefersReducedMotion()) {
            target.current.y = FACE_HOME;
            if (spin.current) spin.current.rotation.y = FACE_HOME;
            return;
        }
        gsap.to(target.current, { y: FACE_HOME, duration: 2.6, ease: EASE.reveal, delay: 0.15 });
    }, [visible]);

    // Drag to spin; let go and it drifts back home after a moment.
    useEffect(() => {
        const el = gl.domElement;
        const d = drag.current;
        const down = (e) => {
            d.active = true;
            d.x = e.clientX;
            clearTimeout(d.idle);
            gsap.killTweensOf(target.current);
            el.setPointerCapture?.(e.pointerId);
        };
        const move = (e) => {
            if (!d.active) return;
            target.current.y += (e.clientX - d.x) * 0.008;
            d.x = e.clientX;
        };
        const up = () => {
            if (!d.active) return;
            d.active = false;
            d.idle = setTimeout(() => {
                // Return by the shortest way round.
                const turns = Math.round((target.current.y - FACE_HOME) / (Math.PI * 2));
                gsap.to(target.current, { y: FACE_HOME + turns * Math.PI * 2, duration: 1.8, ease: 'power3.inOut' });
            }, 2500);
        };
        el.addEventListener('pointerdown', down);
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerup', up);
        el.addEventListener('pointercancel', up);
        return () => {
            clearTimeout(d.idle);
            el.removeEventListener('pointerdown', down);
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerup', up);
            el.removeEventListener('pointercancel', up);
        };
    }, [gl]);

    useFrame((_, delta) => {
        easing.damp(spin.current.rotation, 'y', target.current.y, drag.current.active ? 0.08 : 0.25, delta);
    });

    return (
        <>
            {/* react-globe.gl's lights. The directional light keeps three's
                default position (straight overhead), exactly as globe.gl left it. */}
            <ambientLight color="#cccccc" intensity={Math.PI} />
            <directionalLight color="#ffffff" intensity={0.6 * Math.PI} position={[0, 1, 0]} />

            <group rotation={[TILT, 0, 0]}>
                <group ref={spin} rotation-y={START_SPIN}>
                    <mesh>
                        <sphereGeometry args={[1, 90, 45]} />
                        <meshPhongMaterial map={map} bumpMap={bumpMap} />
                    </mesh>
                    <Graticule />
                    <Pin />
                </group>
                <mesh>
                    <sphereGeometry args={[1 + ATMOSPHERE_ALTITUDE, 90, 45]} />
                    <shaderMaterial args={[atmosphereShader]} side={THREE.BackSide} transparent depthWrite={false} />
                </mesh>
            </group>
        </>
    );
}
