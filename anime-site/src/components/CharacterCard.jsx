import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useCharacter } from '../context/CharacterContext'

export default function CharacterCard({ character, index, isActive, onSelect }) {
  const [isHovered, setIsHovered] = useState(false)
  const hoverStartTime = useRef(0)
  const { activeCharacter } = useCharacter()
   
  // Check if we're on mobile to reduce expensive effects
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
   
  // Text scramble effect - only active on desktop when hovered and active
  const [displayText, setDisplayText] = useState(character.name)
  const chars = '!<>-_\\/[]{}—=+*^?#アイウエオカキクケコサシスセソ'
  const intervalRef = useRef(null)

  useEffect(() => {
    const shouldScramble = !isMobile && isHovered && isActive
    
    if (!shouldScramble) {
      setDisplayText(() => character.name)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    let iteration = 0
    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return character.name
          .split('')
          .map((letter, idx) => {
            if (idx < iteration) return character.name[idx]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      })
      if (iteration >= character.name.length) {
        clearInterval(intervalRef.current)
      }
      iteration += 0.5
    }, 30)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, isActive, isMobile, character.name])
  
  // Simplified 3D effect for mobile, full effect for desktop
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  
  // Reduced physics for mobile
  const mouseXSpring = useSpring(mx, { 
    stiffness: isMobile ? 80 : 150, 
    damping: isMobile ? 10 : 15, 
    mass: 0.5 
  })
  const mouseYSpring = useSpring(my, { 
    stiffness: isMobile ? 80 : 150, 
    damping: isMobile ? 10 : 15, 
    mass: 0.5 
  })
  
  // Reduced rotation range for mobile
  const cardRotateY = useTransform(
    mouseXSpring, 
    [-0.5, 0.5], 
    [isMobile ? "-4deg" : "-8deg", isMobile ? "4deg" : "8deg"]
  )
  
  const handleMouseMove = (e) => {
    if (!isActive || isMobile) return
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(mouseX)
    my.set(mouseY)
  }

  // Whether the video should be visible
  // On mobile: show video when card is active (auto, no tap needed)
  // On desktop: show video on hover only
  const shouldShowVideo = isMobile
    ? (isActive && !activeCharacter)
    : (isHovered && isActive && !activeCharacter)

  // Play/pause video based on visibility
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    if (shouldShowVideo) {
      const playPromise = vid.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently catch - autoplay attr on the element handles iOS
        })
      }
    } else {
      vid.pause()
      vid.currentTime = 0
    }
  }, [shouldShowVideo])

  // When video becomes playable, try to play if it should be showing
  const handleCanPlay = useCallback(() => {
    setVideoLoaded(true)
    if (shouldShowVideo && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [shouldShowVideo])

  const handleClick = useCallback((e) => {
    if (!isActive) return
    if (isMobile) return // Disable video expander on mobile
    onSelect(character)
  }, [isActive, character, isMobile, onSelect])
  
  return (
    <motion.div
      layoutId={`card-container-${character.id}`}
      style={{
        rotateY: cardRotateY,
        transformStyle: "preserve-3d"
      }}
      className={`w-full h-full relative rounded-3xl ${isActive ? 'cursor-pointer cursor-hover-target shadow-2xl focus-visible:ring-2' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { 
        if(isActive) {
          setIsHovered(true)
          hoverStartTime.current = Date.now()
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        mx.set(0)
        my.set(0)
      }}
      onClick={handleClick}
      onKeyDown={(e) => { if (isActive && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleClick(); } }}
      role="button"
      tabIndex={isActive ? 0 : -1}
      aria-label={`View ${character.name}`}
      aria-expanded={false}
      whileHover={isActive && !isMobile ? { scale: 1.02 } : {}}
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
        
        {/* Video - always rendered (never unmounted), visibility controlled by opacity */}
        <div 
          className="absolute inset-0 z-[1] transition-opacity duration-700 ease-in-out"
          style={{ opacity: shouldShowVideo ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            src={character.video}
            poster={character.image}
            preload={isActive ? "auto" : "none"}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={handleCanPlay}
            className="w-full h-full object-cover scale-105"
          />
        </div>

        {/* Character Image */}
        <motion.div
          layoutId={`card-image-${character.id}`}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${shouldShowVideo ? 'opacity-0' : 'opacity-100'}`}
        >
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            className={`object-cover w-full h-full transition-transform duration-700 ${shouldShowVideo ? 'scale-105' : 'scale-100'} ${!isActive ? 'brightness-[0.35] saturate-[0.4]' : ''}`}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent z-[2] transition-opacity duration-700 ${shouldShowVideo ? 'opacity-0' : 'opacity-100'}`} />
        {!isMobile && (
          <div className={`absolute inset-0 z-[2] transition-opacity duration-700 ${shouldShowVideo ? 'opacity-0' : 'opacity-0'}`}>
            <div 
              className="absolute inset-0 opacity-40 mix-blend-color" 
              style={{ backgroundImage: `linear-gradient(to top right, ${character.themeColor}, transparent)` }} 
            />
          </div>
        )}

        {/* Glow effect */}
        {!isMobile && (
          <div className="absolute inset-0 z-[2] transition-all duration-1000" style={{ boxShadow: isHovered && isActive ? `inset 0 0 60px ${character.themeColor}40` : 'none' }} />
        )}

        {/* Index watermark */}
        <div className={`absolute top-4 right-6 md:top-6 md:right-8 text-[4.5rem] md:text-[8rem] lg:text-[10rem] font-display font-extrabold leading-none z-[4] transition-all duration-700 font-sans ${shouldShowVideo ? 'text-white/[0.08]' : 'text-white/[0.03]'}`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Bottom content */}
        <div className={`absolute bottom-0 left-0 right-0 p-5 md:p-12 z-[4] transition-opacity duration-700 ${shouldShowVideo ? 'opacity-0' : 'opacity-100'}`}>
          <motion.h2
            layoutId={`card-name-${character.id}`}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-cinematic font-bold tracking-wider uppercase transition-all duration-500 mb-2 md:mb-3"
            style={{
              textShadow: isHovered && isActive ? `0 0 20px ${character.themeColor}80` : 'none',
              color: isHovered && isActive ? '#fff' : 'rgba(255, 255, 255, 0.3)'
            }}
          >
             {displayText}
          </motion.h2>

          <div 
            className={`h-[3px] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isHovered && isActive ? 'w-24 md:w-32 opacity-100' : 'w-8 opacity-30'}`} 
            style={{ backgroundColor: character.themeColor }}
          />

          <p className={`mt-4 text-[10px] md:text-xs tracking-[0.3em] uppercase font-display transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ color: character.themeColor }}>
            {isMobile ? '⟡ Playing' : '⟡ Tap to unleash'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
