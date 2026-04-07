import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { audioManager } from '../utils/audioManager'
import { useCharacter } from '../context/CharacterContext'

export default function AudioPlayer() {
  const { characters, activeCardIndex, globalThemeColor, isAudioStarted } = useCharacter()
  const [isMuted, setIsMuted] = useState(true)
  const [currentTrack, setCurrentTrack] = useState('')

  // Sync mute state with global start signal
  useEffect(() => {
    if (isAudioStarted) {
      // Use setTimeout to avoid synchronous setState
      setTimeout(() => {
        setIsMuted(false)
        audioManager.setMute(false)
      }, 0)
    }
  }, [isAudioStarted])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    audioManager.setMute(newMuted)
  }, [isMuted])

  // Change BGM when character changes
  useEffect(() => {
    if (!isAudioStarted) return
    const activeCharacter = characters[activeCardIndex]
    if (activeCharacter?.audio) {
      const url = activeCharacter.audio
      if (url === currentTrack) return
      // Use setTimeout to avoid synchronous setState
      setTimeout(() => {
        setCurrentTrack(url)
        audioManager.playBGM(url)
      }, 0)
    }
  }, [activeCardIndex, characters, isAudioStarted, currentTrack])

   return (
     <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[100000] flex items-center gap-3 sm:gap-4">
      <motion.button
        className="w-12 h-12 rounded-full glass-card border border-white/10 flex items-center justify-center group overflow-hidden"
        whileHover={{ scale: 1.1, borderColor: globalThemeColor }}
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute BGM" : "Mute BGM"}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.svg
              key="muted"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white/40"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </motion.svg>
          ) : (
            <motion.svg
              key="unmuted"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white"
              style={{ color: globalThemeColor }}
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </motion.svg>
          )}
        </AnimatePresence>
        
        {/* Decorative inner glow for active audio */}
        {!isMuted && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ backgroundColor: globalThemeColor }}
          />
        )}
      </motion.button>

         {/* Track info hint */}
       <AnimatePresence>
         {!isMuted && (
           <motion.div
             className="glass-card px-3 sm:px-4 py-1 sm:py-2 rounded-lg border border-white/5"
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -10 }}
           >
             <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-display text-white/40 flex items-center gap-1 sm:gap-2">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: globalThemeColor }}></span>
                 <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: globalThemeColor }}></span>
               </span>
               BGM: {characters[activeCardIndex]?.audioLabel || characters[activeCardIndex]?.name}
             </span>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}
