import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedStats from './AnimatedStats'

// Kanji characters for the energy seal
const SEAL_KANJI = '伝説戦闘勝利英雄力強夢希望光闇剣炎雷風水火'.split('')

// Energy Ring particle component
function EnergyRing({ color, delay, size }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${color}20`,
      }}
      initial={{ scale: 0, opacity: 1, rotate: 0 }}
      animate={{ scale: [0, 1.5, 3], opacity: [1, 0.6, 0], rotate: [0, 45, 90] }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
    />
  )
}

// Floating kanji seals
function FloatingSeals({ color }) {
  const seals = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      char: SEAL_KANJI[Math.floor(Math.random() * SEAL_KANJI.length)],
      angle: (i / 12) * Math.PI * 2,
      distance: 120 + Math.random() * 80,
      size: 16 + Math.random() * 20,
    })), []
  )

  return (
    <>
      {seals.map((seal) => {
        const x = Math.cos(seal.angle) * seal.distance
        const y = Math.sin(seal.angle) * seal.distance

        return (
          <motion.span
            key={seal.id}
            className="absolute top-1/2 left-1/2 font-cinematic font-bold pointer-events-none"
            style={{ 
              color, 
              fontSize: seal.size,
              textShadow: `0 0 15px ${color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ 
              x: [0, x * 0.5, x * 2], 
              y: [0, y * 0.5, y * 2], 
              opacity: [0, 1, 0], 
              scale: [0.5, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            {seal.char}
          </motion.span>
        )
      })}
    </>
  )
}

// Typewriter Quote component
function TypewriterQuote({ text, delay, visible }) {
  const [displayedText, setDisplayedText] = useState('')
  
  useEffect(() => {
    if (!visible) {
      setDisplayedText('')
      return
    }

    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, 40)
      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [text, visible, delay])

  return (
    <div className="min-h-[3em] max-w-[400px]">
      <p className="text-white/60 font-display italic text-sm md:text-base leading-relaxed">
        {displayedText}
        <motion.span 
          animate={{ opacity: [1, 0] }} 
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-white/40 ml-1 align-middle"
        />
      </p>
    </div>
  )
}

export default function VideoExpander({ character, onClose }) {
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const [phase, setPhase] = useState(0) // 0=opening, 1=rings, 2=reveal, 3=video

  // Animation timeline when opened
  useEffect(() => {
    if (character) {
      setPhase(0)
      
      const timers = [
        setTimeout(() => setPhase(1), 100),    // Start energy rings
        setTimeout(() => setPhase(2), 800),    // Kanji burst + card expansion starts
        setTimeout(() => {
          setPhase(3)                           // Video reveal
          videoRef.current?.play().catch(() => {})
        }, 1400),
      ]
      
      return () => timers.forEach(clearTimeout)
    } else {
      setPhase(0)
    }
  }, [character])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on outside click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose()
  }, [onClose])

  return (
    <AnimatePresence>
      {character && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[9000] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`card-name-${character.id}`}
          initial={{ backgroundColor: 'rgba(5, 5, 16, 0)' }}
          animate={{ backgroundColor: 'rgba(5, 5, 16, 0.96)' }}
          exit={{ backgroundColor: 'rgba(5, 5, 16, 0)' }}
          transition={{ duration: 0.4 }}
          onClick={handleOverlayClick}
        >
          {/* === GRID LINE OVERLAY behind the expanded card === */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.04 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${character.themeColor} 0px, ${character.themeColor} 1px, transparent 1px, transparent 60px)`,
            }} />
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg, ${character.themeColor} 0px, ${character.themeColor} 1px, transparent 1px, transparent 60px)`,
            }} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050510_80%)]" />
          </motion.div>

          {/* === ENERGY RINGS (Phase 1) === */}
          {phase >= 1 && phase < 3 && (
            <div className="absolute inset-0 z-[9500] pointer-events-none">
              <EnergyRing color={character.themeColor} delay={0} size="200px" />
              <EnergyRing color={character.themeColor} delay={0.15} size="300px" />
              <EnergyRing color={character.themeColor} delay={0.3} size="400px" />
              <EnergyRing color="#ffffff" delay={0.1} size="150px" />
            </div>
          )}

          {/* === FLOATING KANJI SEALS (Phase 2) === */}
          {phase >= 2 && phase < 3 && (
            <div className="absolute inset-0 z-[9500] pointer-events-none flex items-center justify-center">
              <FloatingSeals color={character.themeColor} />
            </div>
          )}

          {/* === CORE GLOW PULSE (Phase 1-2) === */}
          {phase >= 1 && phase < 3 && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-[9400]"
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.2, 1, 2] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                background: `radial-gradient(circle, ${character.themeColor}50 0%, ${character.themeColor}20 30%, transparent 70%)`,
              }}
            />
          )}

          {/* === EXPANDED CARD CONTAINER === */}
          <motion.div
            layoutId={`card-container-${character.id}`}
            className="relative w-[100vw] h-[100vh] md:w-[90vw] md:h-[90vh] md:rounded-3xl overflow-hidden z-[9100]"
            style={{
              boxShadow: `0 0 120px ${character.themeColor}30`,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Video background */}
            <div className="absolute inset-0 z-0 bg-[#050510]">
              <motion.video
                ref={videoRef}
                src={character.video}
                loop
                muted
                playsInline
                preload="metadata"
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ 
                  opacity: phase >= 3 ? 0.85 : 0, 
                  scale: phase >= 3 ? 1 : 1.15,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                className="object-cover w-full h-full"
              />
              {/* Multi-layer video overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/30 to-transparent" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${character.themeColor}08, transparent, ${character.themeColor}08)` }} />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/50 via-transparent to-[#050510]/80" />
            </div>

            {/* Animated border ring */}
            <motion.div
              className="absolute inset-0 md:rounded-3xl z-[1] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 3 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 md:rounded-3xl ring-1" style={{ 
                borderColor: `${character.themeColor}30`, 
                boxShadow: `0 0 60px ${character.themeColor}15, inset 0 0 60px ${character.themeColor}08` 
              }} />
            </motion.div>

            {/* Content grid */}
            <div className="relative z-[2] w-full h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-16 gap-8">
              {/* Character image */}
              <motion.div
                layoutId={`card-image-${character.id}`}
                className="w-[50%] md:w-[30%] h-[35%] md:h-[75%] relative flex-shrink-0"
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="object-cover w-full h-full rounded-2xl shadow-2xl"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{ boxShadow: `0 0 60px ${character.themeColor}40, 0 0 120px ${character.themeColor}15` }}
                />
                <div className="absolute inset-0 rounded-2xl ring-1" style={{ borderColor: `${character.themeColor}50` }} />
              </motion.div>

              {/* Info panel */}
              <div className="flex flex-col items-center md:items-start justify-center gap-6 text-center md:text-left mt-6 md:mt-0">
                <motion.h2
                  layoutId={`card-name-${character.id}`}
                  className="text-4xl md:text-6xl lg:text-7xl font-cinematic font-bold tracking-wider uppercase text-white"
                  style={{ textShadow: `0 0 30px ${character.themeColor}` }}
                >
                  {character.name}
                </motion.h2>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: phase >= 3 ? '12rem' : 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  className="h-[3px]"
                  style={{ backgroundColor: character.themeColor }}
                />

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : -20 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-sm tracking-[0.4em] uppercase font-display"
                  style={{ color: character.themeColor }}
                >
                  ⟡ Legend Unlocked
                </motion.p>

                {/* Floating particles */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase >= 3 ? 1 : 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex gap-4 mt-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: character.themeColor }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.4, 1, 0.4],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
                
                {/* Typewriter Quote */}
                <TypewriterQuote 
                  text={character.textQuote} 
                  delay={1.2} 
                  visible={phase >= 3} 
                />

                {/* RPG Power Stats */}
                <AnimatedStats
                  stats={character.stats}
                  themeColor={character.themeColor}
                  visible={phase >= 3}
                />
              </div>
            </div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 20 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-[20] w-14 h-14 rounded-full glass-card flex items-center justify-center transition-all duration-300 group cursor-hover-target shadow-xl"
              style={{ border: `1px solid ${character.themeColor}40` }}
              whileHover={{ scale: 1.1, backgroundColor: `${character.themeColor}20` }}
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70 group-hover:text-white transition-colors duration-300"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
