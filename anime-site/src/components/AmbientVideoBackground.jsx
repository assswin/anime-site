import { motion, AnimatePresence } from 'framer-motion'
import { useCharacter } from '../context/CharacterContext'
import { useState, useEffect } from 'react'

export default function AmbientVideoBackground() {
  const { characters, activeCardIndex, activeCharacter } = useCharacter()
  const activeChar = characters[activeCardIndex] || characters[0]
  
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <div className="fixed inset-0 w-full h-full z-[-2] bg-[#050510] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeChar?.id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {activeChar && !activeCharacter && (
            isMobile ? (
              <div 
                className="w-full h-full opacity-60" 
                style={{ 
                  background: `radial-gradient(circle at 50% 50%, ${activeChar.themeColor}40 0%, transparent 70%)` 
                }} 
              />
            ) : (
              <video
                src={activeChar.video}
                className="w-full h-full object-cover blur-3xl scale-110"
                style={{ filter: `blur(40px)` }}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            )
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Dark vignette gradient to make the UI readable */}
      <div 
        className="absolute inset-0 z-[-1] pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, #050510 80%), linear-gradient(to bottom, #050510 0%, transparent 20%, #050510 100%)`
        }}
      />
    </div>
  )
}
