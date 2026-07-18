import { useEffect, useState } from 'react'
import Lenis from '@studio-freight/lenis'
import { useCharacter } from '../context/CharacterContext'

export default function SmoothScroll({ children }) {
  const { activeCharacter } = useCharacter()
  const [lenisInstance, setLenisInstance] = useState(null)

  useEffect(() => {
    // Respect user's preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    let rafId
    function raf(time) {
      if (lenis) {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
    }

    rafId = requestAnimationFrame(raf)

    setLenisInstance(lenis)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [])

  // Lock scroll when VideoExpander is open
  useEffect(() => {
    if (!lenisInstance) return
    if (activeCharacter) {
      lenisInstance.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenisInstance.start()
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeCharacter, lenisInstance])

  return <>{children}</>
}
