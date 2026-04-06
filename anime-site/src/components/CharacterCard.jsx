import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Text scramble effect hook
function useTextScramble(text, isHovering) {
  const [displayText, setDisplayText] = useState(text)
  const chars = '!<>-_\\/[]{}—=+*^?#アイウエオカキクケコサシスセソ'
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    let iteration = 0
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) return text[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      if (iteration >= text.length) {
        clearInterval(intervalRef.current)
      }
      iteration += 0.5
    }, 30)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovering, text])

  return displayText
}

export default function CharacterCard({ character, index, isActive, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const scrambledName = useTextScramble(character.name, isHovered && isActive)
  
  // 3D Holographic Parallax Physics
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const mouseXSpring = useSpring(mx, { stiffness: 150, damping: 15, mass: 0.5 })
  const mouseYSpring = useSpring(my, { stiffness: 150, damping: 15, mass: 0.5 })

  // Slight additional rotation on top of the deck tilt
  const cardRotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

  const handleMouseMove = (e) => {
    if (!isActive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(mouseX)
    my.set(mouseY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mx.set(0)
    my.set(0)
  }

  const handleClick = useCallback(() => {
    if (!isActive) return
    onSelect(character)
  }, [character, onSelect, isActive])

  return (
    <motion.div
      layoutId={`card-container-${character.id}`}
      style={{
        rotateY: cardRotateY,
        transformStyle: "preserve-3d"
      }}
      className={`w-full h-full relative rounded-3xl ${isActive ? 'cursor-pointer cursor-hover-target shadow-2xl focus-visible:ring-2' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { if(isActive) setIsHovered(true) }}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => { if (isActive && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleClick(); } }}
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={`View ${character.name}`}
      aria-expanded={false} // Would be true if open, but this is the trigger
      whileHover={isActive ? { scale: 1.02 } : {}}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Animated gradient border synced with theme color */}
      <div className={`absolute inset-0 rounded-3xl transition-opacity duration-700 z-0 ${isHovered ? 'opacity-100' : 'opacity-20'}`}>
        <div 
          className="absolute inset-0 rounded-3xl p-[2px]"
          style={{ background: `linear-gradient(135deg, ${character.themeColor}, #050510, ${character.themeColor})` }}
        >
          <div className="w-full h-full rounded-3xl bg-[#050510]" />
        </div>
      </div>

      {/* Inner content */}
      <div className="absolute inset-[2px] rounded-3xl overflow-hidden bg-[#050510] z-[1]">
        
        {/* Character Image */}
        <motion.div
          layoutId={`card-image-${character.id}`}
          className="absolute inset-0 z-0"
        >
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            className={`object-cover w-full h-full transition-all duration-700 ${isHovered && isActive ? 'scale-105 brightness-[1.1] saturate-[1.2]' : 'scale-100 brightness-[0.35] saturate-[0.4]'}`}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent z-[2]" />
        <div className={`absolute inset-0 z-[2] transition-opacity duration-700 ${isHovered && isActive ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="absolute inset-0 opacity-40 mix-blend-color" 
            style={{ backgroundImage: `linear-gradient(to top right, ${character.themeColor}, transparent)` }} 
          />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 z-[2] transition-all duration-1000" style={{ boxShadow: isHovered && isActive ? `inset 0 0 60px ${character.themeColor}40` : 'none' }} />

        {/* Index watermark */}
        <div className={`absolute top-6 right-8 text-[8rem] md:text-[10rem] font-display font-extrabold leading-none z-[3] transition-all duration-700 font-sans ${isHovered && isActive ? 'text-white/[0.08]' : 'text-white/[0.03]'}`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-[4]">
          <motion.h2
            layoutId={`card-name-${character.id}`}
            className="text-2xl md:text-4xl lg:text-5xl font-cinematic font-bold tracking-wider uppercase transition-all duration-500 mb-3"
            style={{
              textShadow: isHovered && isActive ? `0 0 20px ${character.themeColor}80` : 'none',
              color: isHovered && isActive ? '#fff' : 'rgba(255, 255, 255, 0.3)'
            }}
          >
            {scrambledName}
          </motion.h2>

          <div 
            className={`h-[3px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isHovered && isActive ? 'w-24 md:w-32 opacity-100' : 'w-8 opacity-30'}`} 
            style={{ backgroundColor: character.themeColor }}
          />

          <p className={`mt-4 text-xs tracking-[0.3em] uppercase font-display transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: character.themeColor }}>
            ⟡ Tap to unleash
          </p>
        </div>
      </div>
    </motion.div>
  )
}
