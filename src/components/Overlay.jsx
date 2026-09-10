import { motion, useReducedMotion, useTransform } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

const HEADLINE = [
  { text: 'The' },
  { text: 'Perfect', italic: true },
  { text: 'Pour' },
]

function Section({ className = '', children }) {
  return (
    <section className={`relative flex h-screen w-screen [text-shadow:0_2px_28px_rgba(10,6,3,0.45)] px-6 md:px-16 lg:px-24 ${className}`}>
      {children}
    </section>
  )
}

/**
 * Rendered inside <Scroll html>, which translates this tree with the scroll.
 * Each section is one viewport tall; framer-motion handles the fades.
 */
export default function Overlay({ progress, ready }) {
  const reduce = useReducedMotion()

  // Page 1 — hero dissolves as the camera starts its arc
  const heroOpacity = useTransform(progress, [0, 0.16], [1, 0])
  const heroY = useTransform(progress, [0, 0.25], [0, -120])
  const heroScale = useTransform(progress, [0, 0.25], [1, 0.94])

  // Page 2 — left-side copy holds through the side profile
  const craftOpacity = useTransform(progress, [0.3, 0.45, 0.62, 0.74], [0, 1, 1, 0])
  const craftX = useTransform(progress, [0.3, 0.5], [-80, 0])

  // Page 3 — CTA slides in from the right on the macro
  const shopOpacity = useTransform(progress, [0.82, 0.96], [0, 1])
  const shopX = useTransform(progress, [0.82, 1], [80, 0])

  // Hold the copy (and its intro animation) until the scene has loaded
  if (!ready) return null

  return (
    <div className="text-cream">
      {/* ───────────── Page 1 ───────────── */}
      <Section className="flex-col items-center justify-center text-center">
        <motion.div style={{ opacity: heroOpacity, y: heroY, scale: heroScale }} className="flex flex-col items-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: EASE }}
            className="mb-8 font-sans text-[10px] font-medium tracking-[0.5em] text-cream/60 uppercase md:text-xs"
          >
            CupNSaucer — Ceramic Collection
          </motion.p>

          <h1 className="font-serif text-[clamp(4rem,14vw,15rem)] leading-[0.82] tracking-[-0.035em]">
            {HEADLINE.map(({ text, italic }, i) => (
              <span key={text}>
                <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span
                    className={`inline-block ${italic ? 'italic' : ''}`}
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ type: 'spring', stiffness: 60, damping: 16, mass: 0.9, delay: 0.35 + i * 0.12 }}
                  >
                    {text}
                  </motion.span>
                </span>
                {i < HEADLINE.length - 1 && ' '}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4"
        >
          <span className="font-sans text-[10px] tracking-[0.4em] text-cream/50 uppercase">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-cream/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-cream"
              animate={reduce ? undefined : { y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </Section>

      {/* ───────────── Page 2 ───────────── */}
      <Section className="items-center justify-start">
        <motion.div style={{ opacity: craftOpacity, x: craftX }} className="max-w-xl">
          <p className="mb-6 font-sans text-[10px] font-medium tracking-[0.5em] text-cream/85 uppercase md:text-xs">
            02 — Form
          </p>
          <h2 className="font-serif text-[clamp(3rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.03em]">
            Crafted for <em>the senses.</em>
          </h2>
          <p className="mt-8 max-w-sm font-sans text-sm leading-relaxed font-light text-cream/70 md:text-base">
            A thin, even rim for the first sip. A balanced handle for the last. Glazed to hold warmth
            and catch the light.
          </p>
        </motion.div>
      </Section>

      {/* ───────────── Page 3 ───────────── */}
      <Section className="items-center justify-end">
        <motion.div style={{ opacity: shopOpacity, x: shopX }} className="flex max-w-md flex-col items-end text-right">
          <p className="mb-6 font-sans text-[10px] font-medium tracking-[0.5em] text-cream/85 uppercase md:text-xs">
            03 — Detail
          </p>
          <h3 className="font-serif text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
            Made to be <em>held.</em>
          </h3>

          <motion.a
            href="#shop"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/50 bg-white/20 px-9 py-5 font-sans text-xs font-medium tracking-[0.3em] text-cream uppercase shadow-[0_8px_40px_rgba(14,13,12,0.12)] backdrop-blur-md transition-colors duration-500 hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none"
          >
            Shop the Collection
            <span aria-hidden className="transition-transform duration-500 ease-out group-hover:translate-x-1.5">
              →
            </span>
          </motion.a>
        </motion.div>
      </Section>
    </div>
  )
}
