import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const TRANSITION_TYPES = {
  // Ink wash: dark ink sweeps from center
  'ink-wash': {
    clipPath: ['inset(50% 50% 50% 50%)', 'inset(0% 0% 0% 0%)'],
    background: 'radial-gradient(ellipse at center, #050510 0%, rgba(5,5,16,0.95) 100%)',
  },
  // Glass shatter: triangular fragments
  'shatter': {
    clipPath: [
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      'polygon(10% 10%, 90% 5%, 85% 95%, 15% 90%)',
    ],
    background: 'linear-gradient(135deg, rgba(192,38,211,0.1), #050510, rgba(124,58,237,0.1))',
  },
  // Portal warp: edges bend inward
  'portal': {
    clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    background: 'radial-gradient(ellipse at center, transparent 30%, #050510 100%)',
  },
}

export default function SectionTransition({ type = 'ink-wash', themeColor }) {
  const ref = useRef(null)
  const config = TRANSITION_TYPES[type] || TRANSITION_TYPES['ink-wash']

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Map scroll progress to animation values
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 0.8, 1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const lineWidth = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '100%', '0%'])

  if (type === 'shatter') {
    return (
      <div ref={ref} className="relative h-[20vh] overflow-hidden">
        {/* Shatter fragments */}
        <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: `${15 + Math.random() * 20}%`,
                height: `${30 + Math.random() * 40}%`,
                left: `${i * 16}%`,
                top: `${Math.random() * 30}%`,
                background: `linear-gradient(${45 + i * 30}deg, transparent, ${themeColor || '#c026d3'}10, transparent)`,
                border: `1px solid ${themeColor || '#c026d3'}15`,
                clipPath: `polygon(${Math.random()*20}% ${Math.random()*20}%, ${80+Math.random()*20}% ${Math.random()*30}%, ${70+Math.random()*30}% ${70+Math.random()*30}%, ${Math.random()*30}% ${70+Math.random()*30}%)`,
              }}
            />
          ))}
          {/* Center line */}
          <motion.div
            className="absolute h-[1px] top-1/2"
            style={{
              width: lineWidth,
              background: `linear-gradient(90deg, transparent, ${themeColor || '#c026d3'}, transparent)`,
            }}
          />
        </motion.div>
      </div>
    )
  }

  if (type === 'portal') {
    return (
      <div ref={ref} className="relative h-[20vh] overflow-hidden flex items-center justify-center">
        <motion.div className="absolute inset-0" style={{ opacity }}>
          {/* Concentric rings */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: `${(i + 1) * 25}%`,
                height: `${(i + 1) * 80}%`,
                borderColor: `${themeColor || '#c026d3'}${15 - i * 3}`,
                scale,
              }}
            />
          ))}
          {/* Center glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: themeColor || '#c026d3',
              boxShadow: `0 0 30px ${themeColor || '#c026d3'}60, 0 0 60px ${themeColor || '#c026d3'}30`,
              scale,
            }}
          />
        </motion.div>
      </div>
    )
  }

  // Default: ink-wash
  return (
    <div ref={ref} className="relative h-[15vh] overflow-hidden">
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity }}
      >
        {/* Horizontal divider line that expands */}
        <motion.div
          className="absolute h-[1px] top-1/2"
          style={{
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${themeColor || '#c026d3'}80, ${themeColor || '#7c3aed'}80, ${themeColor || '#06b6d4'}80, transparent)`,
          }}
        />
        {/* Vertical accent marks */}
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-8" style={{ scale }}>
          {['◆', '◇', '◆'].map((s, i) => (
            <span key={i} className="text-[10px] opacity-30" style={{ color: themeColor || '#c026d3' }}>{s}</span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
