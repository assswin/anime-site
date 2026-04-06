import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterCard from './CharacterCard'
import SectionTitle from './SectionTitle'
import { audioManager } from '../utils/audioManager'

export default function ShuffleDeck({ characters, onSelectCharacter, onThemeChange, externalActiveIndex, onActiveIndexChange }) {
  const [activeCardIndex, setActiveCardIndexInternal] = useState(0)
  const totalCards = characters.length
  const deckRef = useRef(null)
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 })

  // Sync with external index (from Command Palette)
  useEffect(() => {
    if (externalActiveIndex !== undefined && externalActiveIndex !== activeCardIndex) {
      setActiveCardIndexInternal(externalActiveIndex)
    }
  }, [externalActiveIndex])

  const setActiveCardIndex = (index) => {
    setActiveCardIndexInternal(index)
    if (onActiveIndexChange) onActiveIndexChange(index)
  }

  // Magnetic cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!deckRef.current) return
      const rect = deckRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = (e.clientX - centerX) / rect.width
      const distY = (e.clientY - centerY) / rect.height
      
      // Only apply magnetic pull if cursor is reasonably close to the deck
      const distance = Math.sqrt(distX * distX + distY * distY)
      if (distance < 1.5) {
        // Active card pulls toward cursor (max 20px)
        setMagneticOffset({
          x: distX * 25,
          y: distY * 15,
        })
      } else {
        setMagneticOffset({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setMagneticOffset({ x: 0, y: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleNext = () => {
    const newIndex = (activeCardIndex + 1) % totalCards
    setActiveCardIndex(newIndex)
    if (onThemeChange) onThemeChange(characters[newIndex].themeColor)
    audioManager.playSFX('/assets/audio/swipe.mp3')
  }

  const handlePrev = () => {
    const newIndex = activeCardIndex === 0 ? totalCards - 1 : activeCardIndex - 1
    setActiveCardIndex(newIndex)
    if (onThemeChange) onThemeChange(characters[newIndex].themeColor)
    audioManager.playSFX('/assets/audio/swipe.mp3')
  }

  const handleDeckClick = (e) => {
    // If user clicks the sides of the deck, navigate
    const xPercent = e.clientX / window.innerWidth
    if (xPercent < 0.35) {
      handlePrev()
    } else if (xPercent > 0.65) {
      handleNext()
    }
  }

  // Calculate 3D deck positions with heavy tilt (60-95 degrees)
  const getCardProps = (cardIndex) => {
    let relativeIndex = cardIndex - activeCardIndex
    if (relativeIndex < 0) relativeIndex += totalCards

    // Active Card (Top of deck)
    if (relativeIndex === 0) {
      return {
        zIndex: 50,
        scale: 1,
        y: 0,
        z: 0,
        rotateX: 0,
        translateZ: 0,
        opacity: 1,
        pointerEvents: 'auto',
        blur: 'blur(0px)',
      }
    }
    // Second Card
    if (relativeIndex === 1) {
      return {
        zIndex: 40,
        scale: 0.9,
        y: -40,
        z: -50,
        rotateX: 0,
        translateZ: -50,
        opacity: 0.8,
        pointerEvents: 'none',
        blur: 'blur(2px)',
      }
    }
    // Third Card
    if (relativeIndex === 2) {
      return {
        zIndex: 30,
        scale: 0.8,
        y: -80,
        z: -100,
        rotateX: 0,
        translateZ: -100,
        opacity: 0.5,
        pointerEvents: 'none',
        blur: 'blur(4px)',
      }
    }
    // Fourth Card
    if (relativeIndex === 3) {
      return {
        zIndex: 20,
        scale: 0.7,
        y: -120,
        z: -150,
        rotateX: 0,
        translateZ: -150,
        opacity: 0.2,
        pointerEvents: 'none',
        blur: 'blur(6px)',
      }
    }
    // Fifth Card
    if (relativeIndex === 4) {
      return {
        zIndex: 10,
        scale: 0.6,
        y: -160,
        z: -200,
        rotateX: 0,
        translateZ: -200,
        opacity: 0.1,
        pointerEvents: 'none',
        blur: 'blur(8px)',
      }
    }
    // Hidden cards
    return {
      zIndex: 0,
      scale: 0.5,
      y: -200,
      z: -250,
      rotateX: 0,
      translateZ: -250,
      opacity: 0,
      pointerEvents: 'none',
      blur: 'blur(10px)',
    }
  }

  const activeCharacter = characters[activeCardIndex]

  return (
    <section 
      className="relative min-h-[110vh] flex flex-col items-center justify-center py-20 overflow-visible legends-deck-area cursor-pointer"
      onClick={handleDeckClick}
    >
      <SectionTitle
        title="The Legends"
        subtitle="Shuffle the deck · Tap to unleash"
      />
      
      {/* === GRID LINE BACKGROUND === */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.07]">
        {/* Vertical grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, ${activeCharacter?.themeColor || '#c026d3'} 0px, ${activeCharacter?.themeColor || '#c026d3'} 1px, transparent 1px, transparent 80px)`,
          transition: 'background-image 1s ease',
        }} />
        {/* Horizontal grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${activeCharacter?.themeColor || '#c026d3'} 0px, ${activeCharacter?.themeColor || '#c026d3'} 1px, transparent 1px, transparent 80px)`,
          transition: 'background-image 1s ease',
        }} />
        {/* Radial fade — grid fades out at the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050510_75%)]" />
      </div>

      {/* 3D Perspective Container */}
      <div 
        ref={deckRef}
        className="relative w-full max-w-[80vw] md:max-w-[45vw] lg:max-w-[35vw] flex items-center justify-center mt-8"
        style={{ 
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          height: '65vh',
        }}
      >
        <AnimatePresence initial={false}>
          {characters.map((character, index) => {
            const props = getCardProps(index)
            
            return (
              <motion.div
                key={character.id}
                className="absolute w-full origin-bottom"
                style={{
                  pointerEvents: props.pointerEvents,
                  transformStyle: 'preserve-3d',
                  height: '85%',
                }}
                initial={{ opacity: 0, y: 80 }}
                animate={{ 
                  opacity: props.opacity, 
                  scale: props.scale, 
                  y: props.y,
                  zIndex: props.zIndex,
                  filter: props.blur,
                  rotateX: props.rotateX,
                  translateZ: props.translateZ,
                  // Magnetic pull: active card moves toward cursor, others push away
                  x: props.zIndex === 50 ? magneticOffset.x : -magneticOffset.x * 0.3,
                }}
                transition={{ 
                  duration: 0.7, 
                  ease: [0.25, 1, 0.5, 1],
                  x: { duration: 0.3, ease: 'easeOut' },
                }}
                // Swipe support
                drag={props.zIndex === 50 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                dragSnapToOrigin={true}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 80) handlePrev()
                  if (info.offset.x < -80) handleNext()
                }}
              >
                <CharacterCard
                  character={character}
                  index={index}
                  isActive={props.zIndex === 50}
                  onSelect={(char) => {
                    audioManager.playSFX('/assets/audio/select.mp3')
                    onSelectCharacter(char)
                  }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Indicators & Meta */}
      <div className="mt-8 flex flex-col items-center gap-6 z-40 relative">
        <motion.div 
          animate={{ x: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-display select-none pointer-events-none"
        >
          ⟨ Click Sides or Drag to Explore ⟩
        </motion.div>

        {/* Active character info & dots */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm tracking-[0.2em] font-display uppercase font-bold" style={{ color: activeCharacter?.themeColor }}>
            {activeCharacter?.name}
          </div>
          <div className="flex gap-1.5">
            {characters.map((_, i) => (
              <motion.div 
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: i === activeCardIndex ? (activeCharacter?.themeColor || '#c026d3') : 'rgba(255,255,255,0.15)' }}
                animate={{ 
                  scale: i === activeCardIndex ? 1.4 : 1,
                  opacity: i === activeCardIndex ? 1 : 0.5
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
