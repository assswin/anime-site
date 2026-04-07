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
    <div
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transition: 'opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s'
      }}
      className="w-full max-w-sm mt-6"
    >
      {/* Stats title */}
      <div
        style={{
          opacity: 0,
          transition: 'opacity 0.6s ease 0.6s'
        }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="w-5 h-[2px]" style={{ backgroundColor: themeColor }} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-display" style={{ color: themeColor }}>
          Power Analysis
        </span>
      </div>

      {/* Stat bars */}
      <div className="flex flex-col gap-3">
        {statEntries.map(([key, value], i) => (
          <div
            key={key}
            className="flex items-center gap-3"
            style={{
              opacity: 0,
              transform: 'translateX(-20px)',
              transition: `opacity 0.4s ease ${0.9 + i * 0.12}s, transform 0.4s ease ${0.9 + i * 0.12}s`
            }}
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
              <div
                className="h-full rounded-full relative"
                style={{ backgroundColor: themeColor }}
                style={{
                  width: '0%',
                  transition: `width 1.2s ease ${1.0 + i * 0.15}s`
                }}
              >
                {/* Shimmer sweep */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  }}
                  style={{
                    transform: 'translateX(-100%)',
                    transition: `transform 0.8s ease-in-out ${1.5 + i * 0.15}s`
                  }}
                />
              </div>
            </div>

            {/* Percentage */}
            <span
              className="text-xs font-display text-white/60 w-8 text-right tabular-nums"
              style={{
                opacity: 0,
                transition: `opacity 0.4s ease ${1.2 + i * 0.15}s`
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Total power score */}
      <div
        className="mt-5 pt-4 border-t flex items-center justify-between"
        style={{
          opacity: 0,
          borderColor: `${themeColor}20`,
          transition: `opacity 0.6s ease 2s`
        }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-display text-white/30">
          Overall Rating
        </span>
        <span
          className="text-2xl font-cinematic font-bold"
          style={{
            color: themeColor,
            textShadow: `0 0 15px ${themeColor}60`,
            opacity: 0,
            transform: 'scale(0)',
            transition: `opacity 0.5s ease 2.2s, transform 0.5s spring 2.2s`
          }}
        >
          {Math.round(statEntries.reduce((sum, [, v]) => sum + v, 0) / statEntries.length)}
        </span>
      </div>
    </div>
  )
}
