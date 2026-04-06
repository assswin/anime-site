import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import CharacterCard from './CharacterCard'
import { audioManager } from '../utils/audio'

export default function HorizontalScroll({ characters, onSelectCharacter, onThemeChange }) {
  const containerRef = useRef(null)
  const totalCards = characters.length
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  // The entire scrollable height — each card gets 100vh of scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Map vertical scroll to horizontal translate
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    ["1%", `-${(totalCards - 1) * (100 / totalCards)}%`]
  )

  // Track the center index and trigger theme changes / audio tics
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate which card is currently in the center (approximate)
    const newIndex = Math.min(
      Math.max(Math.round(latest * (totalCards - 1)), 0),
      totalCards - 1
    )
    
    if (newIndex !== activeCardIndex) {
      setActiveCardIndex(newIndex)
      
      // Pass the theme color up to the Ambilight manager
      if (onThemeChange) {
        onThemeChange(characters[newIndex].themeColor)
      }

      // Play subtle tick on scroll entry
      audioManager.init()
      audioManager.playTick()
    }
  })

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${totalCards * 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Horizontal strip driven by scrollYProgress */}
        <motion.div
          className="flex items-center h-full will-change-transform"
          style={{
            x: translateX,
            width: `${totalCards * 100}%`,
          }}
        >
          {characters.map((character, index) => (
            <div
              key={character.id}
              className="flex items-center justify-center"
              style={{
                width: `${100 / totalCards}%`,
                height: '100%',
              }}
            >
              <CharacterCard
                character={character}
                index={index}
                onSelect={onSelectCharacter}
              />
            </div>
          ))}
        </motion.div>

        {/* Scroll progress dots synced with active theme */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
          {characters.map((char, i) => (
            <ScrollDot
              key={char.id}
              index={i}
              total={totalCards}
              scrollYProgress={scrollYProgress}
              name={char.name}
              color={char.themeColor}
            />
          ))}
        </div>

        {/* Left/Right fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#050510] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#050510] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  )
}

// Individual scroll progress dot
function ScrollDot({ index, total, scrollYProgress, name, color }) {
  const start = index / total
  const end = (index + 1) / total
  const mid = (start + end) / 2

  const opacity = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.2, 1, 0.2]
  )

  const scale = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0.6, 1.3, 0.6]
  )

  const bgOpacity = useTransform(
    scrollYProgress,
    [start, mid, end],
    [0, 1, 0]
  )

  return (
    <div className="relative flex items-center group">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ opacity, scale, backgroundColor: color }}
      />
      {/* Tooltip on hover */}
      <motion.span
        style={{ opacity: bgOpacity, color }}
        className="absolute right-6 whitespace-nowrap text-[10px] font-display tracking-widest uppercase pointer-events-none"
      >
        {name}
      </motion.span>
    </div>
  )
}
