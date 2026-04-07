import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Letter-by-letter stagger animation
const titleVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
}

export default function HeroSection() {
  const title = "ANIME LEGENDS"
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    // Disable expensive mouse tracking on mobile
    if (isMobile) return
    
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
       {/* Radial gradient bg blobs */}
       <div className="absolute inset-0 z-0">
         <motion.div
           animate={{ x: mousePos.x, y: mousePos.y }}
           transition={{ type: 'spring', stiffness: 50, damping: 30 }}
           className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-[150px] sm:w-[40rem] sm:h-[40rem]"
         />
         <motion.div
           animate={{ x: -mousePos.x * 0.7, y: -mousePos.y * 0.7 }}
           transition={{ type: 'spring', stiffness: 50, damping: 30 }}
           className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] rounded-full bg-secondary/10 blur-[120px] sm:w-[32rem] sm:h-[32rem]"
         />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18rem] h-[18rem] rounded-full bg-accent/5 blur-[100px] sm:w-[24rem] sm:h-[24rem]" />
       </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.07] bg-[linear-gradient(rgba(192,38,211,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(192,38,211,0.3)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)]" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-background/30 to-background z-[2]" />

       {/* Content */}
       <div className="z-10 text-center flex flex-col items-center gap-6 px-4 sm:px-8">
        
        {/* Subtitle above */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/60" />
          <span className="text-xs md:text-sm tracking-[0.5em] uppercase text-violet-400/50 font-display">The Legacy of</span>
          <div className="w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/60" />
        </motion.div>

        {/* Main Title — Letter by letter with 3D flip */}
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-9xl font-cinematic font-extrabold tracking-[0.15em] flex flex-wrap justify-center"
          style={{ perspective: '1000px' }}
          aria-label={title}
        >
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className={`inline-block bg-gradient-to-b from-white via-fuchsia-200 to-primary bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(192,38,211,0.4)] ${char === ' ' ? 'mr-4' : ''}`}
              aria-hidden="true"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-base md:text-xl text-violet-300/40 font-display font-light tracking-[0.2em] uppercase"
        >
          Scroll to explore the legacy
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-primary/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-primary/60 rounded-full" />
          </motion.div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-violet-400/30 font-display">Scroll</span>
        </motion.div>
      </div>
    </section>
  )
}
