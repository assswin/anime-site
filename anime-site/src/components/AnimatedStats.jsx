import { motion } from 'framer-motion'

const STAT_ICONS = {
  strength: '⚔️',
  speed: '⚡',
  technique: '🎯',
  power: '💥',
  endurance: '🛡️',
}

const STAT_LABELS = {
  strength: 'STRENGTH',
  speed: 'SPEED',
  technique: 'TECHNIQUE',
  power: 'POWER',
  endurance: 'ENDURANCE',
}

export default function AnimatedStats({ stats, themeColor, visible }) {
  if (!stats || !visible) return null

  const statEntries = Object.entries(stats)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="w-full max-w-sm mt-6"
    >
      {/* Stats title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="w-5 h-[2px]" style={{ backgroundColor: themeColor }} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-display" style={{ color: themeColor }}>
          Power Analysis
        </span>
      </motion.div>

      {/* Stat bars */}
      <div className="flex flex-col gap-3">
        {statEntries.map(([key, value], i) => (
          <motion.div
            key={key}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
          >
            {/* Icon */}
            <span className="text-sm w-6 text-center">{STAT_ICONS[key]}</span>

            {/* Label */}
            <span className="text-[10px] tracking-[0.2em] text-white/40 font-display w-20 uppercase">
              {STAT_LABELS[key]}
            </span>

            {/* Bar container */}
            <div className="flex-1 h-[6px] bg-white/[0.06] rounded-full overflow-hidden relative">
              {/* Animated fill */}
              <motion.div
                className="h-full rounded-full relative"
                style={{ backgroundColor: themeColor }}
                initial={{ width: '0%' }}
                animate={{ width: `${value}%` }}
                transition={{
                  delay: 1.0 + i * 0.15,
                  duration: 1.2,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    delay: 1.5 + i * 0.15,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>

            {/* Percentage */}
            <motion.span
              className="text-xs font-display text-white/60 w-8 text-right tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
            >
              {value}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Total power score */}
      <motion.div
        className="mt-5 pt-4 border-t flex items-center justify-between"
        style={{ borderColor: `${themeColor}20` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-display text-white/30">
          Overall Rating
        </span>
        <motion.span
          className="text-2xl font-cinematic font-bold"
          style={{ color: themeColor, textShadow: `0 0 15px ${themeColor}60` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          {Math.round(statEntries.reduce((sum, [, v]) => sum + v, 0) / statEntries.length)}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
