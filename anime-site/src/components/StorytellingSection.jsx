import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCharacter } from '../context/CharacterContext'

function StorySection({ character, index }) {
  const { setActiveCardIndex, setGlobalThemeColor } = useCharacter()
  const sectionRef = useRef(null)
  
  // Detect when this section is in the center of the viewport
  const isInView = useInView(sectionRef, { margin: "-40% 0px -40% 0px" })

  useEffect(() => {
    if (isInView) {
      setActiveCardIndex(index)
      setGlobalThemeColor(character.themeColor)
    }
  }, [isInView, index, setActiveCardIndex, setGlobalThemeColor, character.themeColor])

  // Split-screen animation variants
  const leftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } }
  }

  const rightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut", delay: 0.2 } }
  }

  return (
    <section 
      id={`story-section-${index}`}
      ref={sectionRef}
      className="relative w-full min-h-[100vh] flex items-center justify-center py-24"
    >
      <div className="w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 z-10 pt-20">
        
        {/* Left Split: Character Image + Glassmorphism Quote */}
        <motion.div 
          className="w-full md:w-1/2 h-full min-h-[500px] max-h-[700px] relative"
          style={{ perspective: 1000 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-20%" }}
          variants={leftVariant}
        >
          {/* Main Character Image */}
          <div 
            className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative"
            style={{ boxShadow: `0 30px 60px -15px ${character.themeColor}60` }}
          >
            <img 
              src={character.image} 
              alt={character.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Gradient overlay to dark bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            {/* Name overlay */}
            <div className="absolute bottom-10 left-8">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-wider drop-shadow-2xl">
                {character.name}
              </h2>
            </div>
          </div>

          {/* Glassmorphism Quote Overlay (Offset) */}
          <motion.div 
            className="absolute -right-4 -bottom-16 md:-right-12 md:bottom-24 w-[85%] md:w-[95%] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl z-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ boxShadow: `0 20px 40px -10px rgba(0,0,0,0.8), inset 0 0 20px ${character.themeColor}30` }}
          >
            <img 
              src={character.quote} 
              alt="Quote" 
              className="w-full h-auto object-contain mix-blend-screen opacity-90 drop-shadow-lg"
            />
            <p className="mt-4 text-white/90 font-serif italic text-lg md:text-xl border-l-4 pl-4" style={{ borderColor: character.themeColor }}>
              "{character.textQuote}"
            </p>
          </motion.div>
        </motion.div>

        {/* Right Split: Transparent (allows background video to shine) + Stats/Info */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col justify-center mt-20 md:mt-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-20%" }}
          variants={rightVariant}
        >
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
            <h3 className="text-2xl font-display uppercase tracking-widest text-white/50 mb-8">Combat Stats</h3>
            
            <div className="space-y-6">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="relative">
                  <div className="flex justify-between text-sm uppercase tracking-wider mb-2 font-display">
                    <span className="text-white/70">{stat}</span>
                    <span className="text-white font-bold">{value}/100</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundColor: character.themeColor }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Theme Soundtrack</p>
                <p className="text-sm text-white/90 font-medium tracking-wide">{character.audioLabel}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-xl"
                style={{ backgroundColor: `${character.themeColor}30`, boxShadow: `0 0 20px ${character.themeColor}50` }}
              >
                🎵
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default function StorytellingSection() {
  const { characters } = useCharacter()
  
  return (
    <div className="w-full flex flex-col relative z-10">
      {characters.map((char, index) => (
        <StorySection key={char.id} character={char} index={index} />
      ))}
    </div>
  )
}
