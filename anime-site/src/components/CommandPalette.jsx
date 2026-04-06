import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CommandPalette({ characters, onSelectCharacter, onNavigateToCharacter }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  // Keyboard shortcut to open/close
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open with / or Ctrl+K
      if ((e.key === '/' && !isOpen && document.activeElement.tagName !== 'INPUT') ||
          (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        setIsOpen(true)
        setQuery('')
      }
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Fuzzy match characters
  const filteredCharacters = useMemo(() => {
    if (!query.trim()) return characters
    const q = query.toLowerCase()
    return characters.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    )
  }, [query, characters])

  const handleSelect = useCallback((character) => {
    setIsOpen(false)
    setQuery('')
    if (onSelectCharacter) onSelectCharacter(character)
  }, [onSelectCharacter])

  const handleNavigate = useCallback((character, index) => {
    setIsOpen(false)
    setQuery('')
    if (onNavigateToCharacter) onNavigateToCharacter(index)
  }, [onNavigateToCharacter])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[99000] flex items-start justify-center pt-[15vh]"
          initial={{ backgroundColor: 'rgba(5, 5, 16, 0)' }}
          animate={{ backgroundColor: 'rgba(5, 5, 16, 0.8)' }}
          exit={{ backgroundColor: 'rgba(5, 5, 16, 0)' }}
          transition={{ duration: 0.2 }}
          onClick={() => { setIsOpen(false); setQuery('') }}
        >
          <motion.div
            className="w-[90vw] max-w-[560px] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(12, 12, 36, 0.95), rgba(20, 20, 53, 0.9))',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(192, 38, 211, 0.2)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 60px rgba(192, 38, 211, 0.1)',
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400/50 flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm font-display tracking-wide outline-none placeholder-white/20"
                placeholder="Search characters or type a command..."
                aria-label="Search characters"
              />
              <span className="text-[10px] text-white/20 bg-white/[0.05] px-2 py-1 rounded font-mono">ESC</span>
            </div>

            {/* Results */}
            <div className="max-h-[45vh] overflow-y-auto py-2" role="listbox">
              {/* Character results */}
              {filteredCharacters.length > 0 ? (
                <>
                  <div className="px-5 py-2">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 font-display">Characters</span>
                  </div>
                  {filteredCharacters.map((character, i) => {
                    const originalIndex = characters.findIndex(c => c.id === character.id)
                    return (
                      <motion.button
                        key={character.id}
                        className="w-full flex items-center gap-4 px-5 py-3 hover:bg-white/[0.04] transition-colors text-left group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleNavigate(character, originalIndex)}
                        role="option"
                        aria-selected={false}
                      >
                        {/* Character thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ring-1" style={{ borderColor: `${character.themeColor}30` }}>
                          <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Character info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/80 font-display tracking-wide group-hover:text-white transition-colors truncate">
                            {character.name}
                          </div>
                          <div className="text-[10px] text-white/20 tracking-widest uppercase">
                            Power: {Math.round(Object.values(character.stats).reduce((a, b) => a + b, 0) / 5)}
                          </div>
                        </div>

                        {/* Theme color dot */}
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: character.themeColor }} />

                        {/* Action hint */}
                        <span className="text-[10px] text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0">
                          ↵ Open
                        </span>
                      </motion.button>
                    )
                  })}
                </>
              ) : (
                <div className="px-5 py-8 text-center text-white/20 text-sm font-display">
                  No characters found
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
              <div className="flex gap-3">
                <span className="text-[10px] text-white/15 flex items-center gap-1">
                  <span className="bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">/</span> to open
                </span>
                <span className="text-[10px] text-white/15 flex items-center gap-1">
                  <span className="bg-white/[0.06] px-1.5 py-0.5 rounded font-mono">↵</span> to select
                </span>
              </div>
              <span className="text-[10px] text-white/10 font-display tracking-widest">COMMAND MODE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
