import { useMemo } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

const TEXTURES = {
  map: '/textures/kitchen_wood/kitchen_wood_diff_2k.jpg',
  normalMap: '/textures/kitchen_wood/kitchen_wood_nor_gl_2k.jpg',
  roughnessMap: '/textures/kitchen_wood/kitchen_wood_rough_2k.jpg',
}

/** Scanned wood tabletop (Poly Haven "Kitchen Wood", CC0) the saucer rests on. */
export default function Table() {
  const maps = useTexture(TEXTURES)

  useMemo(() => {
    for (const texture of Object.values(maps)) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(2.5, 1.8)
      texture.anisotropy = 16
    }
    maps.map.colorSpace = THREE.SRGBColorSpace
  }, [maps])

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -3]} receiveShadow>
      <planeGeometry args={[30, 22]} />
      <meshStandardMaterial
        {...maps}
        color="#e8d2b8"
        normalScale={[0.6, 0.6]}
        envMapIntensity={0.7}
      />
    </mesh>
  )
}
