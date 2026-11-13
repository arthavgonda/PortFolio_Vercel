
import { Float, useGLTF } from '@react-three/drei'
import { DRACO_PATH } from '../constants/index.js'

const ReactLogo = (props) => {
    const { nodes, materials } = useGLTF('/models/react.glb', DRACO_PATH)
    return (
        <Float floatIntensity={1}>
            <group position={[8, 8, 8]} scale={0.4} {...props}>
                <mesh
                    geometry={nodes['React-Logo_Material002_0'].geometry}
                    material={materials['Material.002']}
                    position={[0, 0.79, 0.18]}
                    rotation={[0, 0, -Math.PI / 2]}
                    scale={[0.39, 0.39, 0.5]}
                />
            </group>
        </Float>
    )
}

useGLTF.preload('/models/react.glb', DRACO_PATH)

export default ReactLogo