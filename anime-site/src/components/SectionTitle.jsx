import { motion } from 'framer-motion'

export default function SectionTitle({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="text-center mb-16 md:mb-24"
    >
      {/* Decorative top element */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
      </div>

      <h2 className="text-3xl md:text-5xl font-cinematic font-bold tracking-[0.15em] uppercase bg-gradient-to-r from-violet-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent mb-4">
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm md:text-base font-display tracking-[0.25em] uppercase text-violet-400/40">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
