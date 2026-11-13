import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { easing } from 'maath';
import { MONTHS, TAPE_MONTHS, TAPE_START, TODAY, monthLabel, spans } from '../lib/timeline.js';

/*
 * The Experience timeline: a tape measure of months wound into a helix, one
 * turn per year. Each role is a band on the tape at its real dates, and a fixed
 * playhead at the front reads the time. `time.current.target` (months from the
 * start of the tape) is written by scroll in Experience.jsx; the tape eases to
 * it, so scrolling rewinds from today through each role.
 *
 * Same family as the certificates ring: unlit materials, pointer parallax on
 * the camera, and fog that lets the far side of the helix fall into the page.
 */

const RADIUS = 2;
const PITCH = 1.1; // vertical drop per year (one turn)
const WIDTH = 0.46; // height of the tape
const BAND = [0.32, 0.7]; // where role bands sit across the tape (0 = bottom)

const PPM = 360; // texture pixels per month
const TAPE_PX = Math.round((WIDTH / ((2 * Math.PI * RADIUS) / 12)) * PPM);
const BAND_PX = Math.round(TAPE_PX * (BAND[1] - BAND[0]));
const CHUNK = 6; // months per texture, keeps every texture under 4096px wide

const IDLE = new THREE.Color('#3a3a49');
const ACTIVE = new THREE.Color('#e4e4e6');
const FONT = '"General Sans", sans-serif';

const angleAt = (t) => (t / 12) * Math.PI * 2;
const heightAt = (t) => -(t / 12) * PITCH;

// A strip of the helix from month t0 to t1, between heights v0..v1 (0..1 across
// the tape), pushed `lift` outwards so bands sit just in front of the tape.
function ribbonGeometry(t0, t1, v0, v1, lift = 0) {
    const segments = Math.max(4, Math.ceil((t1 - t0) * 10));
    const positions = new Float32Array((segments + 1) * 6);
    const uvs = new Float32Array((segments + 1) * 4);
    const index = [];
    const r = RADIUS + lift;

    for (let i = 0; i <= segments; i++) {
        const f = i / segments;
        const t = t0 + (t1 - t0) * f;
        const x = Math.sin(angleAt(t)) * r;
        const z = Math.cos(angleAt(t)) * r;
        const y = heightAt(t);
        positions.set([x, y + (v0 - 0.5) * WIDTH, z, x, y + (v1 - 0.5) * WIDTH, z], i * 6);
        uvs.set([f, 0, f, 1], i * 4);
        if (i < segments) {
            const k = i * 2;
            index.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(index);
    return geometry;
}

// Canvas-drawn texture, repainted once the web font has loaded so labels never
// stay in the fallback face.
function useCanvasTexture(width, height, paint, deps) {
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        const draw = () => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);
            paint(ctx, width, height);
            tex.needsUpdate = true;
        };
        draw();
        document.fonts?.load(`600 32px ${FONT}`).then(draw);
        return tex;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    useEffect(() => () => texture.dispose(), [texture]);
    return texture;
}

const useGeometry = (t0, t1, v0, v1, lift) => {
    const geometry = useMemo(() => ribbonGeometry(t0, t1, v0, v1, lift), [t0, t1, v0, v1, lift]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return geometry;
};

function TapeChunk({ from, months }) {
    const geometry = useGeometry(from, from + months, 0, 1, 0);
    const texture = useCanvasTexture(
        months * PPM,
        TAPE_PX,
        (ctx, w, h) => {
            ctx.fillStyle = '#121216';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#2c2c35';
            ctx.fillRect(0, 0, w, 2);
            ctx.fillRect(0, h - 2, w, 2);
            ctx.letterSpacing = '3px';

            for (let m = 0; m < months; m++) {
                const x = m * PPM;
                const abs = TAPE_START + from + m;
                const month = abs % 12;

                ctx.fillStyle = month === 0 ? '#afb0b6' : '#4a4a57';
                ctx.fillRect(x, 0, 3, h * 0.26);
                ctx.fillStyle = '#30303a';
                for (let q = 1; q < 4; q++) ctx.fillRect(x + (q * PPM) / 4, 0, 2, h * (q === 2 ? 0.16 : 0.09));

                ctx.font = `500 ${Math.round(h * 0.13)}px ${FONT}`;
                ctx.fillStyle = month === 0 ? '#e4e4e6' : '#62646c';
                ctx.fillText(month === 0 ? `${MONTHS[month]}  ${Math.floor(abs / 12)}` : MONTHS[month], x + 12, h * 0.9);
            }

            // Today, in the site's "available" green.
            if (TODAY >= from && TODAY < from + months) {
                const x = (TODAY - from) * PPM;
                ctx.fillStyle = '#4ade80';
                ctx.fillRect(x - 1.5, 0, 3, h);
                ctx.font = `600 ${Math.round(h * 0.11)}px ${FONT}`;
                ctx.fillText('TODAY', x + 10, h * 0.22);
            }

            // The tape's two ends dissolve into the page instead of stopping dead.
            // Painted (not transparent) so the helix needs no alpha sorting.
            const fade = PPM * 1.5;
            if (from === 0) {
                const g = ctx.createLinearGradient(0, 0, fade, 0);
                g.addColorStop(0, '#010103');
                g.addColorStop(1, 'rgba(1, 1, 3, 0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, fade, h);
            }
            if (from + months === TAPE_MONTHS) {
                const g = ctx.createLinearGradient(w - fade, 0, w, 0);
                g.addColorStop(0, 'rgba(1, 1, 3, 0)');
                g.addColorStop(1, '#010103');
                ctx.fillStyle = g;
                ctx.fillRect(w - fade, 0, fade, h);
            }
        },
        [from, months],
    );

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
    );
}

// One stretch of a role's band. Long roles are split into several pieces;
// only the true ends of the role get rounded caps.
function SpanPiece({ span, from, months, capStart, capEnd, clock }) {
    const material = useRef();
    const geometry = useGeometry(from, from + months, BAND[0], BAND[1], 0.006);
    const texture = useCanvasTexture(
        Math.round(months * PPM),
        BAND_PX,
        (ctx, w, h) => {
            const inset = 6;
            const r = h / 2;
            const x0 = capStart ? inset : 0;
            const x1 = capEnd ? w - inset : w;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.roundRect(x0, 0, x1 - x0, h, [capStart ? r : 0, capEnd ? r : 0, capEnd ? r : 0, capStart ? r : 0]);
            ctx.fill();

            // Knock the label out of the band, so it reads as the dark tape
            // showing through: crisp at any brightness of the band.
            ctx.globalCompositeOperation = 'destination-out';
            ctx.font = `600 ${Math.round(h * 0.4)}px ${FONT}`;
            ctx.letterSpacing = '5px';
            ctx.textBaseline = 'middle';
            const width = ctx.measureText(span.label).width;
            const gap = h * 1.4;
            let x = x0 + (capStart ? h * 0.7 : h * 0.3);
            while (x + width <= x1 - h * 0.4) {
                ctx.fillText(span.label, x, h / 2 + 1);
                ctx.beginPath();
                ctx.arc(x + width + gap / 2, h / 2, h * 0.06, 0, Math.PI * 2);
                ctx.fill();
                x += width + gap;
            }
            ctx.globalCompositeOperation = 'source-over';
        },
        [span.label, months, capStart, capEnd],
    );

    useFrame((_, delta) => {
        const on = clock.current.t >= span.start && clock.current.t < span.end;
        easing.dampC(material.current.color, on ? ACTIVE : IDLE, 0.25, delta);
    });

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial
                ref={material}
                map={texture}
                color={IDLE}
                transparent
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}

function Span({ span, clock }) {
    const pieces = [];
    for (let from = span.start; from < span.end; from += 10) {
        const months = Math.min(10, span.end - from);
        pieces.push(
            <SpanPiece
                key={from}
                span={span}
                from={from}
                months={months}
                capStart={from === span.start}
                capEnd={from + months === span.end}
                clock={clock}
            />,
        );
    }
    return pieces;
}

function Playhead() {
    return (
        <group position={[0, 0, RADIUS + 0.05]}>
            <mesh>
                <planeGeometry args={[0.012, WIDTH * 1.7]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} fog={false} />
            </mesh>
            <mesh position={[0, WIDTH * 0.85, 0]}>
                <circleGeometry args={[0.03, 24]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} fog={false} />
            </mesh>
        </group>
    );
}

function Rig({ time, clock, readout, children }) {
    const spin = useRef();
    const shown = useRef('');

    useFrame((state, delta) => {
        easing.damp(clock.current, 't', time.current.target, 0.45, delta);
        const t = clock.current.t;
        spin.current.rotation.y = -angleAt(t);
        spin.current.position.y = -heightAt(t);

        easing.damp3(state.camera.position, [-state.pointer.x * 0.7, 0.9 + state.pointer.y * 0.35, 7.4], 0.4, delta);
        state.camera.lookAt(0, 0, 0.6);

        const label = monthLabel(t);
        if (readout.current && label !== shown.current) {
            readout.current.textContent = label;
            shown.current = label;
        }
    });

    return <group ref={spin}>{children}</group>;
}

// Narrow canvases (the phone layout) shrink the helix rather than crop it.
function FitToWidth({ children }) {
    const aspect = useThree((s) => s.size.width / s.size.height);
    return <group scale={Math.min(1, aspect / 1.1)}>{children}</group>;
}

export default function ExperienceScene({ time, readout }) {
    // Starts a few months ahead and winds back into place the first time the
    // canvas is on screen (frames only run while it is visible).
    const clock = useRef({ t: time.current.target + 2.5 });

    const chunks = [];
    for (let from = 0; from < TAPE_MONTHS; from += CHUNK) chunks.push(from);

    return (
        <>
            <fog attach="fog" args={['#010103', 6.4, 9.8]} />
            <FitToWidth>
                <group rotation={[0, 0, -0.06]}>
                    <Rig time={time} clock={clock} readout={readout}>
                        {chunks.map((from) => (
                            <TapeChunk key={from} from={from} months={Math.min(CHUNK, TAPE_MONTHS - from)} />
                        ))}
                        {spans.map((span) => (
                            <Span key={span.label} span={span} clock={clock} />
                        ))}
                    </Rig>
                    <Playhead />
                </group>
            </FitToWidth>
        </>
    );
}
