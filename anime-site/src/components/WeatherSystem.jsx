import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ========================================
// Weather particle configurations
// ========================================
const WEATHER_CONFIGS = {
  // Rengoku — fire embers rising upward
  embers: {
    count: 35,
    generate: (i) => ({
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: 2 + Math.random() * 4,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      color: ['#ff4500', '#ff6b35', '#ffa500', '#ffcc00'][i % 4],
      dx: (Math.random() - 0.5) * 40,
      endY: -20,
      shape: 'circle',
      glow: true,
    }),
  },

  // Gojo — purple lightning bolts
  lightning: {
    count: 8,
    generate: (i) => ({
      x: 10 + Math.random() * 80,
      y: Math.random() * 30,
      size: 1,
      duration: 0.15,
      delay: i * 0.8 + Math.random() * 2,
      color: ['#a78bfa', '#8b5cf6', '#c084fc', '#e9d5ff'][i % 4],
      dx: 0,
      endY: 100,
      shape: 'bolt',
      glow: true,
      repeat: true,
      repeatDelay: 2 + Math.random() * 4,
    }),
  },

  // Zoro — diagonal wind slash lines
  windslash: {
    count: 12,
    generate: (i) => ({
      x: -10,
      y: Math.random() * 100,
      size: 2,
      duration: 0.6 + Math.random() * 0.4,
      delay: i * 0.3,
      color: ['#34d399', '#6ee7b7', '#a7f3d0', '#10b981'][i % 4],
      dx: 120,
      endY: Math.random() * 100,
      shape: 'slash',
      glow: true,
      repeat: true,
    }),
  },

  // Levi — angled rain
  rain: {
    count: 50,
    generate: (i) => ({
      x: Math.random() * 120 - 10,
      y: -10,
      size: 1,
      lineHeight: 15 + Math.random() * 10,
      duration: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 2,
      color: 'rgba(148, 163, 184, 0.4)',
      dx: -15,
      endY: 110,
      shape: 'line',
      glow: false,
      repeat: true,
    }),
  },

  // Luffy — golden sun rays
  sunrays: {
    count: 8,
    generate: (i) => ({
      x: 0,
      y: 0,
      size: 3,
      duration: 4 + Math.random() * 2,
      delay: i * 0.5,
      color: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7'][i % 4],
      dx: 0,
      endY: 0,
      shape: 'ray',
      angle: i * 25 - 30,
      glow: true,
    }),
  },

  // Eren — red ash falling
  ash: {
    count: 40,
    generate: (i) => ({
      x: Math.random() * 100,
      y: -10,
      size: 1.5 + Math.random() * 3,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 4,
      color: ['#ef4444', '#dc2626', '#991b1b', '#7f1d1d'][i % 4],
      dx: (Math.random() - 0.5) * 30,
      endY: 110,
      shape: 'circle',
      glow: false,
    }),
  },

  // Erwin — golden feathers drifting
  feathers: {
    count: 15,
    generate: (i) => ({
      x: Math.random() * 100,
      y: -10,
      size: 8 + Math.random() * 6,
      duration: 5 + Math.random() * 4,
      delay: Math.random() * 5,
      color: ['#fbbf24', '#f59e0b', '#d97706', '#ca8a04'][i % 4],
      dx: (Math.random() - 0.5) * 60,
      endY: 110,
      shape: 'feather',
      glow: true,
    }),
  },

  // Rin — blue flame wisps spiraling up
  blueflame: {
    count: 25,
    generate: (i) => ({
      x: 30 + Math.random() * 40,
      y: 100 + Math.random() * 10,
      size: 3 + Math.random() * 5,
      duration: 2.5 + Math.random() * 3,
      delay: Math.random() * 3,
      color: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#0284c7'][i % 4],
      dx: (Math.random() - 0.5) * 50,
      endY: -20,
      shape: 'circle',
      glow: true,
    }),
  },

  // Sanji — curling smoke from bottom
  smoke: {
    count: 12,
    generate: (i) => ({
      x: 20 + Math.random() * 60,
      y: 105,
      size: 20 + Math.random() * 30,
      duration: 5 + Math.random() * 4,
      delay: Math.random() * 3,
      color: 'rgba(250, 204, 21, 0.08)',
      dx: (Math.random() - 0.5) * 40,
      endY: 30,
      shape: 'smoke',
      glow: false,
    }),
  },

  // Toji — dark void particles pulsing inward
  void: {
    count: 20,
    generate: (i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 6,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
      color: ['#15803d', '#166534', '#14532d', '#052e16'][i % 4],
      dx: 50 - Math.random() * 100,
      endY: 50,
      shape: 'circle',
      glow: true,
      converge: true,
    }),
  },
}

// ========================================
// Individual particle renderer
// ========================================
function WeatherParticle({ config }) {
  if (config.shape === 'bolt') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: 2,
          height: '40vh',
          background: `linear-gradient(180deg, transparent, ${config.color}, transparent)`,
          filter: `drop-shadow(0 0 8px ${config.color})`,
          opacity: 0,
        }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          repeatDelay: config.repeatDelay,
          times: [0, 0.1, 0.5, 1],
        }}
      />
    )
  }

  if (config.shape === 'slash') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: '30vw',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          filter: config.glow ? `drop-shadow(0 0 6px ${config.color})` : 'none',
          transform: 'rotate(-25deg)',
          opacity: 0,
        }}
        animate={{
          left: [`${config.x}%`, `${config.x + config.dx}%`],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    )
  }

  if (config.shape === 'ray') {
    return (
      <motion.div
        className="absolute pointer-events-none origin-top-left"
        style={{
          left: '0%',
          top: '0%',
          width: '150vw',
          height: 3,
          background: `linear-gradient(90deg, ${config.color}, transparent)`,
          filter: `blur(2px)`,
          transform: `rotate(${config.angle}deg)`,
        }}
        animate={{ opacity: [0.05, 0.2, 0.05] }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )
  }

  if (config.shape === 'line') {
    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: 1,
          height: config.lineHeight,
          backgroundColor: config.color,
          transform: 'rotate(15deg)',
        }}
        animate={{
          left: [`${config.x}%`, `${config.x + config.dx}%`],
          top: [`${config.y}%`, `${config.endY}%`],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
        }}
      />
    )
  }

  if (config.shape === 'feather') {
    return (
      <motion.div
        className="absolute pointer-events-none text-current"
        style={{
          left: `${config.x}%`,
          top: `${config.y}%`,
          fontSize: config.size,
          color: config.color,
          filter: config.glow ? `drop-shadow(0 0 4px ${config.color})` : 'none',
        }}
        animate={{
          top: [`${config.y}%`, `${config.endY}%`],
          left: [`${config.x}%`, `${config.x + config.dx}%`],
          rotate: [0, 360],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✦
      </motion.div>
    )
  }

  if (config.shape === 'smoke') {
    return (
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: `${config.x}%`,
          top: `${config.y}%`,
          width: config.size,
          height: config.size,
          backgroundColor: config.color,
          filter: 'blur(15px)',
        }}
        animate={{
          top: [`${config.y}%`, `${config.endY}%`],
          left: [`${config.x}%`, `${config.x + config.dx}%`],
          scale: [0.5, 1.5, 2],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: config.duration,
          delay: config.delay,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    )
  }

  // Default: circle particle (embers, ash, blueflame, void)
  return (
    <motion.div
      className="absolute pointer-events-none rounded-full"
      style={{
        left: `${config.x}%`,
        top: `${config.y}%`,
        width: config.size,
        height: config.size,
        backgroundColor: config.color,
        filter: config.glow ? `blur(1px) drop-shadow(0 0 ${config.size}px ${config.color})` : 'none',
      }}
      animate={{
        top: config.converge ? ['0%', '45%', '50%'] : [`${config.y}%`, `${config.endY}%`],
        left: config.converge ? [`${config.x}%`, '48%', '50%'] : [`${config.x}%`, `${config.x + config.dx}%`],
        opacity: config.converge ? [0.8, 0.6, 0] : [0, 0.8, 0],
        scale: config.converge ? [1, 0.5, 0] : [0.5, 1, 0.5],
      }}
      transition={{
        duration: config.duration,
        delay: config.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// ========================================
// Main Weather System Component
// ========================================
export default function WeatherSystem({ character }) {
  const weatherType = character?.weather
  const config = WEATHER_CONFIGS[weatherType]

  const particles = useMemo(() => {
    if (!config) return []
    return Array.from({ length: config.count }, (_, i) => ({
      id: i,
      ...config.generate(i),
    }))
  }, [weatherType]) // Regenerate when character changes

  if (!config) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weatherType}
        className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {particles.map((p) => (
          <WeatherParticle key={p.id} config={p} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
