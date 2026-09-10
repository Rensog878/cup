import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Studio-grade stand-in used when /cup-and-saucer.glb is missing or fails
 * to parse. Sized to match the normalised GLTF (3 units wide, rim ≈ y 1.23).
 */
const SAUCER_PROFILE = [
  [0, 0], [0.55, 0], [0.6, 0.03], [1.2, 0.08], [1.5, 0.2], [1.52, 0.225],
  [1.48, 0.235], [1.18, 0.125], [0.64, 0.075], [0, 0.07],
]

const CUP_PROFILE = [
  [0, 0.07], [0.38, 0.07], [0.4, 0.1], [0.37, 0.14], [0.5, 0.2], [0.66, 0.45],
  [0.74, 0.85], [0.76, 1.2], [0.765, 1.23], [0.745, 1.235], [0.72, 1.18],
  [0.7, 0.85], [0.62, 0.45], [0.45, 0.25], [0, 0.22],
]

const lathe = (profile) =>
  new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 128)

export default function ProceduralCup(props) {
  const { saucer, cup, handle, coffee } = useMemo(
    () => ({
      saucer: lathe(SAUCER_PROFILE),
      cup: lathe(CUP_PROFILE),
      handle: new THREE.TorusGeometry(0.28, 0.055, 32, 96, Math.PI * 1.1),
      coffee: new THREE.CircleGeometry(0.705, 96),
    }),
    [],
  )

  return (
    <group {...props}>
      <mesh geometry={saucer} castShadow receiveShadow>
        <Porcelain />
      </mesh>
      <mesh geometry={cup} castShadow receiveShadow>
        <Porcelain />
      </mesh>
      <mesh geometry={handle} position={[0.78, 0.72, 0]} rotation={[0, 0, -Math.PI * 0.55]} castShadow>
        <Porcelain />
      </mesh>
      <mesh geometry={coffee} position={[0, 1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Light crema keeps the hero headline legible where it crosses the cup */}
        <meshPhysicalMaterial color="#9c6b43" roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.2} />
      </mesh>
    </group>
  )
}

function Porcelain() {
  return (
    <meshPhysicalMaterial
      color="#f5f2eb"
      roughness={0.28}
      clearcoat={1}
      clearcoatRoughness={0.06}
      sheen={0.25}
      sheenColor="#fff7ec"
      side={THREE.DoubleSide}
    />
  )
}
