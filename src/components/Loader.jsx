import { Html, useProgress } from '@react-three/drei'

export default function Loader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="flex w-48 flex-col items-center gap-5 select-none" role="status" aria-live="polite">
        <span className="font-serif text-3xl text-cream italic">CupNSaucer</span>
        <div className="h-px w-full overflow-hidden bg-cream/15">
          <div
            className="h-full origin-left bg-cream transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <span className="font-sans text-[10px] tracking-[0.35em] text-cream/50 tabular-nums">
          {progress.toFixed(0).padStart(3, '0')}
        </span>
      </div>
    </Html>
  )
}
