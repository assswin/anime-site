import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCharacter } from '../context/CharacterContext'

export default function GlobalBackground() {
  const { characters, hoveredCharacterId, activeCardIndex } = useCharacter()
  const activeChar = hoveredCharacterId 
    ? characters.find(c => c.id === hoveredCharacterId) 
    : characters[activeCardIndex] || characters[0]
  
  return (
    <div className="fixed inset-0 w-full h-full z-[-2] bg-[#050510] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeChar?.id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          {activeChar && (
            <video
              src={activeChar.video}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Dark overlay to make content readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050510] via-[#050510]/60 to-[#050510]/80 z-[-1]" />
    </div>
  )
}
