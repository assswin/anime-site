import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { characters } from '../data/characters'

const CharacterContext = createContext(null)

export const CharacterProvider = ({ children }) => {
  const [activeCharacter, setActiveCharacter] = useState(null)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [globalThemeColor, setGlobalThemeColor] = useState(characters[0].themeColor)
  const [isAudioStarted, setIsAudioStarted] = useState(false)

  const handleSelectCharacter = useCallback((character) => {
    setActiveCharacter(character)
  }, [])

  const handleCloseExpander = useCallback(() => {
    setActiveCharacter(null)
  }, [])

  const handleNavigateToCharacter = useCallback((index) => {
    if (index >= 0 && index < characters.length) {
      setActiveCardIndex(index)
      setGlobalThemeColor(characters[index].themeColor)
    }
  }, [])

  const value = useMemo(() => ({
    characters,
    activeCharacter,
    activeCardIndex,
    globalThemeColor,
    isAudioStarted,
    setIsAudioStarted,
    setActiveCardIndex,
    setGlobalThemeColor,
    handleSelectCharacter,
    handleCloseExpander,
    handleNavigateToCharacter
  }), [activeCharacter, activeCardIndex, globalThemeColor, isAudioStarted, handleSelectCharacter, handleCloseExpander, handleNavigateToCharacter])

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacter = () => {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider')
  }
  return context
}
