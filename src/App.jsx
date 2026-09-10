import { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, Scroll, ScrollControls, useScroll } from '@react-three/drei'
import { motion, useMotionValue } from 'framer-motion'
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
  // Drops effects and resolution once if the device can't hold its frame rate
  const [highQuality, setHighQuality] = useState(true)
  // ScrollControls' damping already smooths the offset; one shared value drives 3D and DOM.
  // (A second spring on top would only add latency between the wheel and the camera.)
  const progress = useMotionValue(0)

  return (
    <main className="fixed inset-0 bg-espresso">
      <Canvas
        shadows="percentage"
        dpr={highQuality ? [1, 1.5] : 1}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 7.6, 0.1], fov: 30, near: 0.01, far: 100 }}
      >
        {/* Shown only until the café HDRI background loads */}
        <color attach="background" args={['#15100c']} />

        <PerformanceMonitor flipflops={2} onDecline={() => setHighQuality(false)} onFallback={() => setHighQuality(false)} />

        <ScrollControls pages={3} damping={0.2}>
          <ScrollProgress value={progress} />
          <Suspense fallback={<Loader />}>
            <Scene progress={progress} highQuality={highQuality} />
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
