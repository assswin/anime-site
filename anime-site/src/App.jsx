import { useState } from 'react'
import { LayoutGroup } from 'framer-motion'
import SmoothScroll from './components/SmoothScroll'
import HeroSection from './components/HeroSection'
import ShuffleDeck from './components/ShuffleDeck'
import VideoExpander from './components/VideoExpander'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import SectionTitle from './components/SectionTitle'
import WebGLBackground from './components/WebGLBackground'
import WeatherSystem from './components/WeatherSystem'
import SectionTransition from './components/SectionTransition'
import CommandPalette from './components/CommandPalette'
import AudioPlayer from './components/AudioPlayer'
import ErrorBoundary from './components/ErrorBoundary'
import { FloatingParticles, CustomCursor, ScrollProgress, AnimatedCounter, CharacterMarquee } from './components/Effects'
import { CharacterProvider, useCharacter } from './context/CharacterContext'

function AppContent({ loaded, setLoaded }) {
  const { 
    characters,
    activeCharacter, 
    activeCardIndex, 
    globalThemeColor,
    setActiveCardIndex,
    setGlobalThemeColor,
    handleSelectCharacter,
    handleCloseExpander,
    handleNavigateToCharacter
  } = useCharacter()

  // Track active character in the deck for the weather system
  const activeWeatherCharacter = characters[activeCardIndex]

  return (
    <>
      {/* Interactive WebGL Liquid Smoke Background */}
      <WebGLBackground themeColor={globalThemeColor} />

      {/* Character Weather System — ambient particles */}
      {loaded && <WeatherSystem character={activeWeatherCharacter} />}

      {/* Cinematic 5-Phase Preloader */}
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {loaded && (
        <ErrorBoundary>
          <LayoutGroup>
            <SmoothScroll>
              {/* Global Effects */}
              <FloatingParticles themeColor={globalThemeColor} />
              <CustomCursor themeColor={globalThemeColor} />
              <ScrollProgress themeColor={globalThemeColor} />

              <main className="relative min-h-screen w-full noise-overlay vignette" style={{ background: 'transparent' }}>
                
                {/* === AMBILIGHT OVERLAY === */}
                <div 
                  className="fixed inset-0 pointer-events-none z-[-1] opacity-30 transition-colors duration-1000 mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle at 50% 100%, ${globalThemeColor} 0%, transparent 60%)`
                  }}
                />

                {/* === HERO === */}
                <HeroSection />

                {/* === TRANSITION: Hero → Marquee (Ink Wash) === */}
                <SectionTransition type="ink-wash" themeColor={globalThemeColor} />

                {/* === MARQUEE STRIP === */}
                <section className="relative py-8 overflow-hidden">
                  <CharacterMarquee characters={characters} />
                </section>

                {/* === TRANSITION: Marquee → Stats (Shatter) === */}
                <SectionTransition type="shatter" themeColor={globalThemeColor} />

                {/* === STATS SECTION === */}
                <section className="relative py-24 md:py-32 max-w-5xl mx-auto px-6">
                  <SectionTitle
                    title="By The Numbers"
                    subtitle="The Legends in data"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <AnimatedCounter value="10" label="Legendary Characters" icon="⚔️" />
                    <AnimatedCounter value="10" label="Epic Moments" icon="🎬" />
                    <AnimatedCounter value="5" label="Anime Series" icon="📺" />
                    <AnimatedCounter value="100" label="Battles Fought" icon="🔥" />
                  </div>
                </section>

                {/* === TRANSITION: Stats → Deck (Portal) === */}
                <SectionTransition type="portal" themeColor={globalThemeColor} />

                {/* === 3D CARD SHUFFLE DECK === */}
                <section className="relative w-full z-10">
                  <ShuffleDeck
                    characters={characters}
                    onSelectCharacter={handleSelectCharacter}
                    onThemeChange={(color) => setGlobalThemeColor(color)}
                    externalActiveIndex={activeCardIndex}
                    onActiveIndexChange={setActiveCardIndex}
                  />
                </section>

                {/* === FOOTER === */}
                <Footer />
              </main>
            </SmoothScroll>

            {/* === VIDEO EXPANDER OVERLAY === */}
            <VideoExpander
              character={activeCharacter}
              onClose={handleCloseExpander}
            />

            {/* === COMMAND PALETTE === */}
            <CommandPalette
              characters={characters}
              onSelectCharacter={handleSelectCharacter}
              onNavigateToCharacter={handleNavigateToCharacter}
            />

            {/* === BGM PLAYER === */}
            <AudioPlayer />
          </LayoutGroup>
        </ErrorBoundary>
      )}
    </>
  )
}

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <CharacterProvider>
      <AppContent loaded={loaded} setLoaded={setLoaded} />
    </CharacterProvider>
  )
}

export default App
