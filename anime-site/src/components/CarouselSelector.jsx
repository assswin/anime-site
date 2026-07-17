import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCharacter } from '../context/CharacterContext'

export default function CarouselSelector() {
  const { characters, setHoveredCharacterId, setGlobalThemeColor } = useCharacter()
  const containerRef = useRef(null)

  const { scrollXProgress } = useScroll({ container: containerRef })

  const scrollToCharacter = (index) => {
    const section = document.getElementById(`story-section-${index}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden py-12 pt-24 z-10">
      
      {/* Title */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20">
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-widest text-white/90 drop-shadow-2xl">
          Anime Legends
        </h1>
        <p className="text-white/50 tracking-[0.3em] uppercase text-sm mt-2">Select your hero</p>
      </div>

      <div 
        ref={containerRef}
        className="w-full flex gap-8 px-[10vw] md:px-[35vw] overflow-x-auto snap-x snap-mandatory hide-scrollbar items-center h-full pb-10"
        style={{ scrollBehavior: 'smooth' }}
        onMouseLeave={() => {
          setHoveredCharacterId(null)
        }}
      >
        {characters.map((char, index) => {
          return (
            <motion.div
              key={char.id}
              className="relative shrink-0 w-[260px] h-[380px] md:w-[320px] md:h-[480px] snap-center cursor-pointer group"
              style={{ perspective: 1000 }}
              onMouseEnter={() => {
                setHoveredCharacterId(char.id)
                setGlobalThemeColor(char.themeColor)
              }}
              onClick={() => scrollToCharacter(index)}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Card Inner */}
              <div 
                className="w-full h-full rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-500 transform-gpu"
                style={{ 
                  boxShadow: `0 20px 40px -10px ${char.themeColor}50`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Character Image */}
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-50 group-hover:blur-sm"
                  loading="lazy"
                />

                {/* Hover Quote Image (Parallax Foreground) */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center p-6 transform-gpu"
                  style={{ transform: 'translateZ(50px) translateY(20px)', transitionProperty: 'opacity, transform' }}
                >
                  <div className="w-full h-full flex items-center justify-center group-hover:translate-y-0 transition-transform duration-700 delay-100">
                    <img 
                      src={char.quote} 
                      alt="Quote" 
                      className="w-full h-auto object-contain drop-shadow-2xl mix-blend-screen"
                      style={{ filter: `drop-shadow(0 0 20px ${char.themeColor}80)` }}
                    />
                  </div>
                </div>

                {/* Overlay Name */}
                <div 
                  className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-transform duration-500 group-hover:translate-y-full"
                >
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider" style={{ textShadow: `0 0 10px ${char.themeColor}` }}>
                    {char.name}
                  </h3>
                </div>
                
                {/* Frame border */}
                <div 
                  className="absolute inset-0 border-[2px] border-white/10 rounded-2xl pointer-events-none transition-colors duration-300 group-hover:border-white/40"
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Custom Scrollbar Progress */}
      <div className="absolute bottom-10 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white/50 origin-left"
          style={{ scaleX: scrollXProgress }}
        />
      </div>
    </div>
  )
}
