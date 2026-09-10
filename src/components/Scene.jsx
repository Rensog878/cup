import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import CupAndSaucer from './CupAndSaucer'
import Effects from './Effects'
import ModelBoundary from './ModelBoundary'
import ProceduralCup from './ProceduralCup'
import Table from './Table'
import { KEYFRAMES, MIDPOINT } from '../timeline'

const { clamp, lerp, damp, smootherstep } = THREE.MathUtils
const { top, side, macro } = KEYFRAMES

// Real café interior (Poly Haven "Comfy Café", CC0): lights the porcelain and forms the backdrop
const HDRI = '/hdri/comfy_cafe_2k.hdr'
const HDRI_ROTATION = [0, Math.PI * 0.35, 0]

// Scratch objects: no allocations inside the frame loop
const spherical = new THREE.Spherical()
const position = new THREE.Vector3()
const target = new THREE.Vector3()

/**
 * @param {import('framer-motion').MotionValue<number>} progress
 *   Spring-smoothed scroll progress (0 → 1), shared with the HTML overlay.
 */
export default function Scene({ progress }) {
  const model = useRef()
  const dof = useRef()
  const parallax = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const { camera, pointer, size } = state
    const p = clamp(progress.get(), 0, 1)

    // Act I → II: orbit from zenith to side profile. Act II → III: dolly in.
    const orbit = smootherstep(p, 0, MIDPOINT)
    const dolly = smootherstep(p, MIDPOINT, 1)

    // Pull back on portrait screens so the saucer stays in frame
    const aspect = size.width / size.height
    const fit = aspect < 1 ? clamp(1.15 / aspect, 1, 2.2) : 1
    const shiftX = aspect < 1 ? 0 : 1

    target.lerpVectors(top.target, side.target, orbit)
    target.x *= shiftX
    spherical.set(lerp(top.radius, side.radius, orbit) * fit, lerp(top.polar, side.polar, orbit), 0)
    position.setFromSpherical(spherical).add(target)

    position.lerp(macro.position, dolly)
    target.lerp(macro.target, dolly)

    // Subtle pointer parallax, faded out for the macro shot
    const px = parallax.current
    px.x = damp(px.x, pointer.x * 0.35 * (1 - dolly), 3, delta)
    px.y = damp(px.y, pointer.y * 0.2 * (1 - dolly), 3, delta)
    position.x += px.x
    position.y += px.y

    camera.position.copy(position)
    camera.lookAt(target)

    const fov = lerp(lerp(top.fov, side.fov, orbit), macro.fov, dolly)
    if (Math.abs(camera.fov - fov) > 1e-3) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    if (model.current) model.current.rotation.y = Math.PI * orbit

    // Focus pull: the look-at point stays sharp; depth of field narrows for the macro
    const effect = dof.current
    if (effect?.target) {
      effect.target.copy(target)
      if (effect.cocMaterial) effect.cocMaterial.worldFocusRange = lerp(2.6, 0.3, dolly)
      effect.bokehScale = lerp(3, 7, dolly)
    }
  })

  return (
    <>
      <Environment
        files={HDRI}
        background
        backgroundBlurriness={0.04}
        backgroundIntensity={0.8}
        environmentIntensity={0.9}
        backgroundRotation={HDRI_ROTATION}
        environmentRotation={HDRI_ROTATION}
      />

      {/* Warm window key: casts the real cup-on-saucer and saucer-on-table shadows */}
      <directionalLight
        position={[-3.5, 7, 2.5]}
        intensity={1.5}
        color="#ffe2bf"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-bias={-0.0001}
        shadow-normalBias={0.03}
        shadow-radius={5}
      />

      <group ref={model}>
        <ModelBoundary fallback={<ProceduralCup />}>
          <CupAndSaucer />
        </ModelBoundary>
      </group>

      <Table />

      <ContactShadows
        position={[0, 0.002, 0]}
        scale={6}
        resolution={1024}
        far={1.2}
        blur={2}
        opacity={0.55}
        color="#1a120b"
      />

      <Effects dofRef={dof} />
    </>
  )
}
