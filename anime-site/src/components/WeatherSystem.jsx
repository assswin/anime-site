import { useRef, useEffect, useState, useCallback } from 'react'

// ========================================
// Weather particle configurations
// ========================================
const WEATHER_CONFIGS = {
  // Rengoku — fire embers rising upward
  embers: {
    count: 35,
    mobileCount: 15,
    generate: (i, w, h) => ({
      x: Math.random() * w,
      y: h + Math.random() * (h * 0.2),
      size: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(1 + Math.random() * 1.5),
      color: ['#ff4500', '#ff6b35', '#ffa500', '#ffcc00'][i % 4],
      opacity: 0,
      maxOpacity: 0.6 + Math.random() * 0.4,
      life: 0,
      maxLife: 180 + Math.random() * 240,
      shape: 'circle',
      glow: true,
    }),
  },

  // Gojo — purple lightning bolts
  lightning: {
    count: 8,
    mobileCount: 4,
    generate: (i, w, h) => ({
      x: w * 0.1 + Math.random() * w * 0.8,
      y: Math.random() * h * 0.3,
      size: 2,
      speedX: 0,
      speedY: 0,
      color: ['#a78bfa', '#8b5cf6', '#c084fc', '#e9d5ff'][i % 4],
      opacity: 0,
      maxOpacity: 1,
      life: 0,
      maxLife: 10 + Math.random() * 5,
      cooldown: 0,
      cooldownMax: 120 + Math.random() * 240,
      boltHeight: h * 0.4,
      shape: 'bolt',
      glow: true,
    }),
  },

  // Zoro — diagonal wind slash lines
  windslash: {
    count: 12,
    mobileCount: 6,
    generate: (i, w, h) => ({
      x: -w * 0.1,
      y: Math.random() * h,
      size: 2,
      speedX: 8 + Math.random() * 4,
      speedY: (Math.random() - 0.5) * 2,
      color: ['#34d399', '#6ee7b7', '#a7f3d0', '#10b981'][i % 4],
      opacity: 0,
      maxOpacity: 0.8,
      life: 0,
      maxLife: 30 + Math.random() * 20,
      cooldown: i * 18,
      cooldownMax: 60,
      slashWidth: w * 0.3,
      shape: 'slash',
      glow: true,
    }),
  },

  // Levi — angled rain
  rain: {
    count: 50,
    mobileCount: 20,
    generate: (i, w, h) => ({
      x: Math.random() * w * 1.2 - w * 0.1,
      y: -10,
      size: 1,
      lineHeight: 15 + Math.random() * 10,
      speedX: -1.5,
      speedY: 8 + Math.random() * 4,
      color: 'rgba(148, 163, 184, 0.4)',
      opacity: 0.4 + Math.random() * 0.2,
      maxOpacity: 0.6,
      life: 0,
      maxLife: 9999,
      shape: 'line',
      glow: false,
    }),
  },

  // Luffy — golden sun rays
  sunrays: {
    count: 8,
    mobileCount: 5,
    generate: (i, w, h) => ({
      x: 0,
      y: 0,
      size: 3,
      speedX: 0,
      speedY: 0,
      color: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7'][i % 4],
      opacity: 0.05,
      maxOpacity: 0.2,
      life: 0,
      maxLife: 9999,
      angle: (i * 25 - 30) * (Math.PI / 180),
      rayLength: Math.max(w, h) * 1.5,
      pulseSpeed: 0.005 + Math.random() * 0.005,
      pulseOffset: i * 0.8,
      shape: 'ray',
      glow: true,
    }),
  },

  // Eren — red ash falling
  ash: {
    count: 40,
    mobileCount: 18,
    generate: (i, w, h) => ({
      x: Math.random() * w,
      y: -10,
      size: 1.5 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: 0.5 + Math.random() * 1,
      color: ['#ef4444', '#dc2626', '#991b1b', '#7f1d1d'][i % 4],
      opacity: 0,
      maxOpacity: 0.6 + Math.random() * 0.3,
      life: 0,
      maxLife: 240 + Math.random() * 240,
      shape: 'circle',
      glow: false,
    }),
  },

  // Erwin — golden feathers drifting
  feathers: {
    count: 15,
    mobileCount: 8,
    generate: (i, w, h) => ({
      x: Math.random() * w,
      y: -20,
      size: 8 + Math.random() * 6,
      speedX: (Math.random() - 0.5) * 1,
      speedY: 0.5 + Math.random() * 0.8,
      color: ['#fbbf24', '#f59e0b', '#d97706', '#ca8a04'][i % 4],
      opacity: 0,
      maxOpacity: 0.6,
      life: 0,
      maxLife: 300 + Math.random() * 240,
      rotation: 0,
      rotationSpeed: 0.02 + Math.random() * 0.03,
      shape: 'feather',
      glow: true,
    }),
  },

  // Rin — blue flame wisps spiraling up
  blueflame: {
    count: 25,
    mobileCount: 12,
    generate: (i, w, h) => ({
      x: w * 0.3 + Math.random() * w * 0.4,
      y: h + Math.random() * (h * 0.1),
      size: 3 + Math.random() * 5,
      speedX: (Math.random() - 0.5) * 1,
      speedY: -(1.5 + Math.random() * 1.5),
      color: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#0284c7'][i % 4],
      opacity: 0,
      maxOpacity: 0.7 + Math.random() * 0.3,
      life: 0,
      maxLife: 150 + Math.random() * 180,
      shape: 'circle',
      glow: true,
    }),
  },

  // Sanji — curling smoke from bottom
  smoke: {
    count: 12,
    mobileCount: 6,
    generate: (i, w, h) => ({
      x: w * 0.2 + Math.random() * w * 0.6,
      y: h + 10,
      size: 20 + Math.random() * 30,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -(0.3 + Math.random() * 0.5),
      color: 'rgba(250, 204, 21, 0.08)',
      opacity: 0,
      maxOpacity: 0.5,
      life: 0,
      maxLife: 300 + Math.random() * 240,
      scale: 0.5,
      shape: 'smoke',
      glow: false,
    }),
  },

  // Toji — dark void particles pulsing inward
  void: {
    count: 20,
    mobileCount: 10,
    generate: (i, w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      targetX: w * 0.5,
      targetY: h * 0.5,
      size: 4 + Math.random() * 6,
      speedX: 0,
      speedY: 0,
      color: ['#15803d', '#166534', '#14532d', '#052e16'][i % 4],
      opacity: 0,
      maxOpacity: 0.6 + Math.random() * 0.2,
      life: 0,
      maxLife: 180 + Math.random() * 120,
      shape: 'void',
      glow: true,
    }),
  },
}

// ========================================
// Parse CSS color to RGBA components
// ========================================
function parseColor(color) {
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
    if (match) return { r: +match[1], g: +match[2], b: +match[3], a: match[4] ? +match[4] : 1 }
  }
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    }
  }
  return { r: 255, g: 255, b: 255, a: 1 }
}

// ========================================
// Canvas Weather System Component
// ========================================
export default function WeatherSystem({ character }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const fadeRef = useRef(0)
  const prevWeatherRef = useRef(null)
  const [weatherType, setWeatherType] = useState(null)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Regenerate particles when character changes
  const initParticles = useCallback((type, w, h) => {
    const config = WEATHER_CONFIGS[type]
    if (!config) return []
    const count = isMobile ? (config.mobileCount || Math.floor(config.count * 0.4)) : config.count
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      ...config.generate(i, w, h),
    }))
  }, [isMobile])

  // Handle weather type transitions
  useEffect(() => {
    const newType = character?.weather || null
    if (newType !== prevWeatherRef.current) {
      prevWeatherRef.current = newType
      fadeRef.current = 0
      setWeatherType(newType)
    }
  }, [character])

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    if (weatherType) {
      particlesRef.current = initParticles(weatherType, window.innerWidth, window.innerHeight)
    } else {
      particlesRef.current = []
    }

    const config = WEATHER_CONFIGS[weatherType]

    function animate() {
      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      if (fadeRef.current < 1) {
        fadeRef.current = Math.min(1, fadeRef.current + 0.016)
      }

      const globalAlpha = fadeRef.current

      if (!config || particlesRef.current.length === 0) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (p.cooldown !== undefined && p.cooldown > 0) {
          p.cooldown--
          continue
        }

        p.life++

        const fadeInEnd = p.maxLife * 0.15
        const fadeOutStart = p.maxLife * 0.75
        let lifeAlpha = 1
        if (p.life < fadeInEnd) {
          lifeAlpha = p.life / fadeInEnd
        } else if (p.life > fadeOutStart) {
          lifeAlpha = 1 - (p.life - fadeOutStart) / (p.maxLife - fadeOutStart)
        }
        lifeAlpha = Math.max(0, Math.min(1, lifeAlpha))

        const alpha = p.maxOpacity * lifeAlpha * globalAlpha

        if (alpha <= 0.01) {
          if (p.life >= p.maxLife) {
            const fresh = config.generate(p.id, w, h)
            Object.assign(p, fresh, { life: 0 })
            if (p.cooldown !== undefined) {
              p.cooldown = p.cooldownMax || 0
            }
          }
          continue
        }

        p.x += p.speedX
        p.y += p.speedY

        const { r, g, b } = parseColor(p.color)

        ctx.save()
        ctx.globalAlpha = alpha

        if (p.glow) {
          ctx.shadowColor = p.color
          ctx.shadowBlur = p.size * 3
        }

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
          ctx.fill()
        }

        else if (p.shape === 'line') {
          ctx.strokeStyle = p.color
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.speedX * 2, p.y + (p.lineHeight || 15))
          ctx.stroke()
          if (p.y > h + 20) {
            p.y = -20
            p.x = Math.random() * w * 1.2 - w * 0.1
          }
        }

        else if (p.shape === 'bolt') {
          const boltH = p.boltHeight || h * 0.4
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`
          ctx.lineWidth = 2
          ctx.shadowBlur = 15
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          let cy = p.y
          const segments = 8
          for (let s = 0; s < segments; s++) {
            cy += boltH / segments
            const jitter = (Math.random() - 0.5) * 30
            ctx.lineTo(p.x + jitter, cy)
          }
          ctx.stroke()
          if (p.life >= p.maxLife) {
            p.life = 0
            p.cooldown = p.cooldownMax
            p.x = w * 0.1 + Math.random() * w * 0.8
          }
        }

        else if (p.shape === 'slash') {
          const slashW = p.slashWidth || w * 0.3
          const angle = -25 * (Math.PI / 180)
          const endX = p.x + Math.cos(angle) * slashW
          const endY = p.y + Math.sin(angle) * slashW
          const gradient = ctx.createLinearGradient(p.x, p.y, endX, endY)
          gradient.addColorStop(0, 'transparent')
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`)
          gradient.addColorStop(1, 'transparent')
          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(endX, endY)
          ctx.stroke()
          if (p.life >= p.maxLife) {
            p.life = 0
            p.cooldown = p.cooldownMax || 60
            p.x = -w * 0.1
            p.y = Math.random() * h
          }
        }

        else if (p.shape === 'ray') {
          const pulseAlpha = 0.05 + Math.sin(Date.now() * p.pulseSpeed + p.pulseOffset) * 0.1
          ctx.globalAlpha = Math.max(0, pulseAlpha) * globalAlpha
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(
            Math.cos(p.angle) * p.rayLength,
            Math.sin(p.angle) * p.rayLength
          )
          ctx.stroke()
        }

        else if (p.shape === 'feather') {
          p.rotation += p.rotationSpeed
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
          ctx.font = `${p.size}px serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('\u2726', 0, 0)
          ctx.resetTransform()
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        else if (p.shape === 'smoke') {
          const progress = p.life / p.maxLife
          const scale = 0.5 + progress * 1.5
          const radius = p.size * scale
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        }

        else if (p.shape === 'void') {
          const progress = p.life / p.maxLife
          const tx = p.targetX || w / 2
          const ty = p.targetY || h / 2
          const drawX = p.x + (tx - p.x) * progress
          const drawY = p.y + (ty - p.y) * progress
          const drawSize = p.size * (1 - progress * 0.8)
          ctx.beginPath()
          ctx.arc(drawX, drawY, Math.max(0.5, drawSize), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
          ctx.fill()
        }

        ctx.restore()

        if (p.life >= p.maxLife && p.shape !== 'bolt' && p.shape !== 'slash') {
          const fresh = config.generate(p.id, w, h)
          Object.assign(p, fresh, { life: 0 })
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [weatherType, initParticles])

  if (!character?.weather) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
