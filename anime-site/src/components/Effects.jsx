import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ============================
// Floating Particles Component
// ============================
function FloatingParticles({ themeColor }) {
  // Further reduce particle count on mobile for performance
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20;
   
  // Precompute particle data to avoid impure functions during render
  const particles = useMemo(() => {
    // Generate deterministic but varied values for each particle
    return Array.from({ length: particleCount }, (_, i) => {
      // Use a simple hash function based on index to generate pseudo-random values
      const seed = i * 167 + 23; // Simple hash to vary values per particle
      
      // Deterministic "random" values based on seed
      const x = (seed * 97) % 100;
      const y = (seed * 101) % 100;
      const size = ((seed * 103) % 20) / 10 + 0.5; // 0.5 to 2.5
      const delay = ((seed * 107) % 30) / 10; // 0 to 3
      const duration = 8 + ((seed * 109) % 20) / 10; // 8 to 10
      const colorIndex = (seed * 113) % 4; // 0 to 3
      const opacity = ((seed * 127) % 25) / 100 + 0.05; // 0.05 to 0.3
      
      return {
        id: i,
        x,
        y,
        size,
        delay,
        duration,
        color: ['#c026d3', '#7c3aed', '#06b6d4', '#ec4899'][colorIndex],
        opacity
      };
    });
  }, [themeColor, particleCount])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        // Generate deterministic animation values based on particle properties
        const seed = p.id * 137 + 17;
        const xOffset1 = ((seed * 223) % 120) - 60; // -60 to 60
        const xOffset2 = ((seed * 227) % 120) - 60; // -60 to 60
        const opacityMultiplier = ((seed * 229) % 100) / 100 + 0.5; // 0.5 to 1.5
        
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: (seed % 2 === 0 && themeColor) ? themeColor : p.color,
              opacity: p.opacity,
              filter: `blur(${p.size > 2 ? 1 : 0}px)`,
            }}
            animate={{
              y: [0, -100, -200, -300],
              x: [0, xOffset1, xOffset2, 0],
              opacity: [p.opacity, p.opacity * opacityMultiplier, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  )
}

// ============================
// Custom Cursor Component
// ============================
function CustomCursor({ themeColor }) {
  const cursorRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [isDeck, setIsDeck] = useState(false)
  const [cursorSide, setCursorSide] = useState('center') // 'left', 'right', 'center'

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) return

    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX - 10 + 'px'
        cursorRef.current.style.top = e.clientY - 10 + 'px'
        
        // If in deck area, determine side
        const xPercent = e.clientX / window.innerWidth
        if (xPercent < 0.35) setCursorSide('left')
        else if (xPercent > 0.65) setCursorSide('right')
        else setCursorSide('center')
      }
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .cursor-hover-target')
      if (target) setHovering(true)
      
      const deck = e.target.closest('.legends-deck-area')
      if (deck) setIsDeck(true)
    }

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .cursor-hover-target')
      if (target) setHovering(false)
      
      const deck = e.target.closest('.legends-deck-area')
      if (deck) setIsDeck(false)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isDeck])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor hidden md:block ${hovering ? 'hovering' : ''} ${isDeck ? 'is-deck' : ''}`}
      style={hovering && themeColor ? { borderColor: themeColor, backgroundColor: `${themeColor}20` } : {}}
    >
      {isDeck && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center justify-between w-full px-1.5">
            <span className={`text-[10px] transition-opacity duration-300 ${cursorSide === 'left' ? 'opacity-100' : 'opacity-20'}`}>⟨</span>
            <span className={`text-[10px] transition-opacity duration-300 ${cursorSide === 'right' ? 'opacity-100' : 'opacity-20'}`}>⟩</span>
          </div>
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[6px] uppercase tracking-[0.2em] font-bold mt-0.5 text-white/60"
          >
            {cursorSide === 'left' ? 'PREV' : cursorSide === 'right' ? 'NEXT' : 'SELECT'}
          </motion.span>
        </div>
      )}
    </div>
  )
}

// ============================
// Scroll Progress Bar
// ============================
function ScrollProgress({ themeColor }) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress, background: themeColor ? `linear-gradient(90deg, #c026d3, ${themeColor}, #06b6d4)` : undefined }}
    />
  )
}

// ============================
//  Character Count Stat Box
// ============================
function AnimatedCounter({ value, label, icon }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView])

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = parseInt(value)
    const increment = end / 60
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-8 text-center flex flex-col items-center gap-3 group hover:border-primary/40 transition-all duration-500"
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-5xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        {count}+
      </span>
      <span className="text-sm tracking-widest uppercase text-violet-300/60">{label}</span>
    </motion.div>
  )
}

// ============================
// Marquee Character Strip
// ============================
function CharacterMarquee({ characters }) {
  const doubled = [...characters, ...characters]

  return (
    <div className="w-full overflow-hidden py-12">
      <div className="flex animate-marquee gap-6">
        {doubled.map((char, i) => (
          <div
            key={`${char.id}-${i}`}
            className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/60 transition-all duration-500 group relative"
          >
            <img
              src={char.image}
              alt={char.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-2">
              <span className="text-[10px] font-display font-semibold tracking-wider text-cyan-300 uppercase">{char.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { FloatingParticles, CustomCursor, ScrollProgress, AnimatedCounter, CharacterMarquee }
