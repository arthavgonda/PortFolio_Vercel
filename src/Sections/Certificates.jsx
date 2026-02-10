import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Environment, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import '../constants/util.js'

function useWindowScroll(ref) {
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return

            const rect = ref.current.getBoundingClientRect()
            const sectionHeight = rect.height
            const windowHeight = window.innerHeight

            const scrollStart = -rect.top
            const scrollRange = sectionHeight - windowHeight

            if (scrollStart <= 0) {
                setScrollProgress(0)
            } else if (scrollStart >= scrollRange) {
                setScrollProgress(1)
            } else {
                setScrollProgress(scrollStart / scrollRange)
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll)
    }, [ref])

    return scrollProgress
}

function Rig({ scrollProgress, ...props }) {
    const ref = useRef()
    const targetRotation = useRef(0)

    useFrame((state, delta) => {
        targetRotation.current = -scrollProgress * Math.PI * 2 + state.clock.elapsedTime * 0.1

        easing.damp(ref.current.rotation, 'y', targetRotation.current, 0.5, delta)

        state.events.update()
        easing.damp3(
            state.camera.position,
            [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
            0.3,
            delta
        )
        state.camera.lookAt(0, 0, 0)
    })

    return <group ref={ref} {...props} />
}

function Carousel({ radius = 1.0, count = 5 }) {
    return Array.from({ length: count }, (_, i) => (
        <Card
            key={i}
            url={`/img${Math.floor(i % 10) + 1}_.jpg`}
            position={[Math.sin((i / count) * Math.PI * 2) * radius, 0, Math.cos((i / count) * Math.PI * 2) * radius]}
            rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
    ))
}

function Card({ url, ...props }) {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    const pointerOver = (e) => (e.stopPropagation(), hover(true))
    const pointerOut = () => hover(false)
    useFrame((state, delta) => {
        easing.damp3(ref.current.scale, hovered ? 1.15 : 1, 0.1, delta)
        easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
        easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
    })
    return (
        <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut} {...props}>
            <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
        </Image>
    )
}

function Banner({ scrollProgress, ...props }) {
    const ref = useRef()
    const texture = useTexture('/work.png')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping

    useFrame((state, delta) => {
        // Animate based on scroll delta approximation
        ref.current.material.time.value += delta * 2
        ref.current.material.map.offset.x = scrollProgress * 5
    })

    return (
        <mesh ref={ref} {...props}>
            <cylinderGeometry args={[1.3, 1.3, 0.14, 128, 16, true]} />
            <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[30, 1]} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
    )
}

const Certificates = () => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null)
    const scrollProgress = useWindowScroll(sectionRef)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current)
            }
        }
    }, [isVisible])

    return (
        <section id = "certificates" ref={sectionRef} className="c-space my-20" style={{ minHeight: '400vh' }}>
            <div className="sticky top-0 w-full h-screen">
                <p className="head-text mb-8">My Certificates</p>
                <div className="w-full h-full">
                    {isVisible ? (
                        <Canvas camera={{ position: [0, 0, 100], fov: 15 }} style={{ background: 'transparent' }}>
                            <fog attach="fog" args={['#a79', 8.5, 12]} />
                            <Rig rotation={[0, 0, 0.15]} scrollProgress={scrollProgress}>
                                <Carousel />
                            </Rig>
                            <Banner position={[0, -0.15, 0]} scrollProgress={scrollProgress} />
                            <Environment preset="dawn" blur={0.5} />
                        </Canvas>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Loading...
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Certificates