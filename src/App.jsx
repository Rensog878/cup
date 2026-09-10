import { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Scroll, ScrollControls, useScroll } from '@react-three/drei'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Scene from './components/Scene'
import Overlay from './components/Overlay'
import Loader from './components/Loader'

/** Pipes Drei's damped scroll offset into a framer-motion MotionValue. */
function ScrollProgress({ value }) {
  const scroll = useScroll()
  useFrame(() => {
    if (value.get() !== scroll.offset) value.set(scroll.offset)
  })
  return null
}

/** Commits only once everything in its Suspense boundary has resolved. */
function Ready({ onReady }) {
  useEffect(() => onReady(true), [onReady])
  return null
}

export default function App() {
  const [ready, setReady] = useState(false)
  const rawProgress = useMotionValue(0)
  // One spring drives both the 3D timeline and the DOM overlays, so they never drift apart
  const progress = useSpring(rawProgress, { stiffness: 140, damping: 28, mass: 0.5, restDelta: 0.0001 })

  return (
    <main className="fixed inset-0 bg-espresso">
      <Canvas
        shadows="percentage"
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 7.6, 0.1], fov: 30, near: 0.01, far: 100 }}
      >
        {/* Shown only until the café HDRI background loads */}
        <color attach="background" args={['#15100c']} />

        <ScrollControls pages={3} damping={0.2}>
          <ScrollProgress value={rawProgress} />
          <Suspense fallback={<Loader />}>
            <Scene progress={progress} />
            <Ready onReady={setReady} />
          </Suspense>
          {/* Kept outside Suspense: Drei creates its DOM root on mount, so it must mount exactly once */}
          <Scroll html style={{ width: '100%' }}>
            <Overlay progress={progress} ready={ready} />
          </Scroll>
        </ScrollControls>
      </Canvas>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 md:px-16 lg:px-24">
        <a href="/" className="pointer-events-auto font-serif text-2xl tracking-tight text-cream">
          CupNSaucer
        </a>
        <nav className="pointer-events-auto hidden gap-10 font-sans text-[11px] tracking-[0.3em] text-cream/70 uppercase md:flex">
          <a href="#collection" className="transition-colors hover:text-cream">Collection</a>
          <a href="#story" className="transition-colors hover:text-cream">Story</a>
          <a href="#shop" className="transition-colors hover:text-cream">Shop</a>
        </nav>
      </header>

      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="pointer-events-none fixed bottom-0 left-0 z-10 h-px w-full origin-left bg-cream/70"
      />
    </main>
  )
}
