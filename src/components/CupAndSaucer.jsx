import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { MODEL } from '../timeline'

/**
 * Renders every mesh in the GLTF declaratively from `nodes` + `materials`.
 * World transforms are baked per mesh so any hierarchy in the source file
 * renders correctly, and the whole model is normalised to MODEL.diameter.
 *
 * For a fully hand-authored JSX tree with named nodes, run:
 *   npx gltfjsx public/cup-and-saucer.glb --transform
 */
export default function CupAndSaucer(props) {
  const { scene, nodes, materials } = useGLTF(MODEL.url)

  const { meshes, scale, offset } = useMemo(() => {
    scene.updateMatrixWorld(true)

    const meshes = Object.values(nodes)
      .filter((node) => node.isMesh)
      .map((mesh) => {
        const position = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        const scale = new THREE.Vector3()
        mesh.matrixWorld.decompose(position, quaternion, scale)

        const material = Array.isArray(mesh.material)
          ? mesh.material
          : (materials[mesh.material.name] ?? mesh.material)

        return { key: mesh.uuid, geometry: mesh.geometry, material, position, quaternion, scale }
      })

    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    return {
      meshes,
      scale: MODEL.diameter / Math.max(size.x, size.z),
      offset: [-center.x, -box.min.y, -center.z],
    }
  }, [scene, nodes, materials])

  return (
    <group {...props} dispose={null}>
      <group scale={scale}>
        <group position={offset}>
          {meshes.map(({ key, ...mesh }) => (
            <mesh key={key} castShadow receiveShadow {...mesh} />
          ))}
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(MODEL.url)
