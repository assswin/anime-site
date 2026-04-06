import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { audioManager } from '../utils/audioManager'
import { useCharacter } from '../context/CharacterContext'

// ============================
// Phase Configuration
// ============================
const PHASE_TIMINGS = {
  PARTICLE_APPEAR: 0,      // 0s – single particle
  PARTICLE_EXPLODE: 500,   // 0.5s – ring explosion
  KANJI_RAIN: 1500,        // 1.5s – kanji rain + converge
  TITLE_MORPH: 2500,       // 2.5s – title reveal
  DISSOLVE: 3800,          // 3.8s – dissolve out
  COMPLETE: 4800,          // 4.8s – call onComplete
}

// Kanji characters for the rain effect
const KANJI_CHARS = '伝説戦闘勝利英雄力強夢希望光闇剣炎雷風水火土氷龍鬼神魂武士道忍者'.split('')

// ============================
// Particle Ring Component
// ============================
function ParticleRing({ phase }) {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2
      return {
        id: i,
        angle,
        color: ['#c026d3', '#7c3aed', '#06b6d4', '#ec4899', '#f97316'][i % 5],
        size: Math.random() * 3 + 2,
        delay: i * 0.02,
      }
    })
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => {
        const radius = phase >= 2 ? 200 + Math.random() * 100 : 0
        const x = Math.cos(p.angle) * radius
        const y = Math.sin(p.angle) * radius

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: 'blur(0.5px)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={
              phase >= 2
                ? {
                    x,
                    y,
                    opacity: phase >= 4 ? 0 : [0, 1, 0.7],
                    scale: phase >= 4 ? 0 : [0, 1.5, 1],
                  }
                : phase >= 1
                ? { x: 0, y: 0, opacity: 1, scale: [0, 2, 1] }
                : { x: 0, y: 0, opacity: 0, scale: 0 }
            }
            transition={{
              duration: phase >= 2 ? 1 : 0.5,
              delay: p.delay,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        )
      })}
    </div>
  )
}

// ============================
// Kanji Rain Component
// ============================
function KanjiRain({ active, converge }) {
  const columns = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (i / 30) * 100,
      chars: Array.from({ length: 8 }, () => KANJI_CHARS[Math.floor(Math.random() * KANJI_CHARS.length)]),
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 0.5,
      opacity: Math.random() * 0.4 + 0.2,
    }))
  }, [])

  if (!active) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute top-0 flex flex-col gap-1"
          style={{ left: `${col.x}%` }}
          initial={{ y: '-100%', opacity: col.opacity }}
          animate={
            converge
              ? {
                  y: '50vh',
                  x: `${50 - col.x}vw`,
                  opacity: 0,
                  scale: 0,
                }
              : {
                  y: '120%',
                  opacity: [col.opacity, col.opacity, 0],
                }
          }
          transition={{
            duration: converge ? 0.8 : col.speed,
            delay: col.delay,
            ease: converge ? [0.25, 1, 0.5, 1] : 'linear',
          }}
        >
          {col.chars.map((char, j) => (
            <span
              key={j}
              className="text-xs md:text-sm font-cinematic text-primary/60"
              style={{
                textShadow: '0 0 8px rgba(192, 38, 211, 0.4)',
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      ))}

      {/* Center convergence target — "伝説" */}
      {converge && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 1.5] }}
          transition={{ duration: 1, times: [0, 0.3, 0.7, 1] }}
        >
          <span className="text-5xl md:text-7xl font-cinematic font-bold text-primary text-glow">
            伝説
          </span>
        </motion.div>
      )}
    </div>
  )
}

// ============================
// Title Reveal Component
// ============================
function TitleReveal({ active }) {
  const title = 'ANIME LEGENDS'

  if (!active) return null

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap justify-center" style={{ perspective: '1000px' }}>
        {title.split('').map((char, i) => (
          <motion.span
            key={i}
            className={`text-4xl md:text-7xl lg:text-8xl font-cinematic font-extrabold tracking-[0.12em] bg-gradient-to-b from-white via-fuchsia-200 to-primary bg-clip-text text-transparent inline-block ${char === ' ' ? 'mr-4' : ''}`}
            initial={{ opacity: 0, y: 60, rotateX: -90, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{
              delay: i * 0.05,
              duration: 0.6,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{
              textShadow: '0 0 30px rgba(192, 38, 211, 0.5), 0 0 60px rgba(124, 58, 237, 0.3)',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>

      {/* Glow burst behind title */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0.3, 1.5, 2] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          background: 'radial-gradient(circle, rgba(192,38,211,0.3) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}

// ============================
// Main Preloader Component
// ============================
export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(true)

  const { setIsAudioStarted } = useCharacter()

  const handleComplete = useCallback(() => {
    // Initialize audio context on first interaction to bypass browse autoplay blocks
    audioManager.init()
    setIsAudioStarted(true)
    onComplete()
  }, [setIsAudioStarted, onComplete])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), PHASE_TIMINGS.PARTICLE_APPEAR),
      setTimeout(() => setPhase(2), PHASE_TIMINGS.PARTICLE_EXPLODE),
      setTimeout(() => setPhase(3), PHASE_TIMINGS.KANJI_RAIN),
      setTimeout(() => setPhase(4), PHASE_TIMINGS.TITLE_MORPH),
      setTimeout(() => setPhase(5), PHASE_TIMINGS.DISSOLVE),
      setTimeout(() => {
        setVisible(false)
        setTimeout(handleComplete, 600)
      }, PHASE_TIMINGS.COMPLETE),
    ]

    return () => timers.forEach(clearTimeout)
  }, [handleComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-background overflow-hidden"
          exit={{
            opacity: 0,
            filter: 'blur(10px)',
            scale: 1.05,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background ambient glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
            animate={{
              opacity: phase >= 1 ? 0.3 : 0,
              scale: phase >= 2 ? 1.5 : phase >= 1 ? 1 : 0.5,
            }}
            transition={{ duration: 1 }}
            style={{
              background: 'radial-gradient(circle, rgba(192,38,211,0.2) 0%, rgba(124,58,237,0.1) 40%, transparent 70%)',
            }}
          />

          {/* Phase 1-2: Particle ring */}
          <ParticleRing phase={phase} />

          {/* Phase 3: Kanji rain */}
          <KanjiRain active={phase >= 3 && phase < 5} converge={phase >= 4} />

          {/* Phase 4: Title reveal */}
          <TitleReveal active={phase >= 4 && phase < 5} />

          {/* Phase 5: Final dissolve — everything fades up */}
          {phase >= 5 && (
            <motion.div
              className="absolute inset-0 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(to top, #050510 0%, transparent 100%)',
              }}
            />
          )}

          {/* Corner decorations */}
          <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${phase >= 1 ? 'bg-primary/60' : 'bg-white/10'}`} />
            <span className="text-[10px] tracking-[0.5em] uppercase text-violet-400/30 font-display">
              Loading
            </span>
          </div>

          {/* Phase indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {[1, 2, 3, 4, 5].map((p) => (
              <motion.div
                key={p}
                className={`w-8 h-[2px] rounded-full transition-all duration-300 ${phase >= p ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/10'}`}
                animate={phase >= p ? { scaleX: 1 } : { scaleX: 0.5 }}
              />
            ))}
          </div>

          {/* Phase 1+ : Skip Button */}
          {phase >= 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleComplete}
              className="absolute top-8 right-8 z-[100] px-4 py-2 rounded-full glass-card border border-white/10 hover:border-primary/50 text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-white transition-all cursor-pointer cursor-hover-target"
            >
              Skip Intro
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
