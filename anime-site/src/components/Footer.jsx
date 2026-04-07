import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative w-full pt-16 sm:pt-24 pb-8 sm:pb-12 overflow-hidden">
      {/* Top divider */}
      <div className="section-divider mb-16" />

       {/* Background glow */}
       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-[18rem] bg-primary/5 blur-[150px] rounded-full sm:w-[40rem] sm:h-[24rem]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-cinematic font-bold tracking-[0.2em] bg-gradient-to-r from-primary via-fuchsia-300 to-secondary bg-clip-text text-transparent mb-6"
        >
          ANIME LEGENDS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-violet-400/40 text-sm font-display tracking-widest mb-8 max-w-md mx-auto"
        >
          A tribute to the characters that shaped our imagination and fueled our spirit.
        </motion.p>

        {/* Social-like links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          {['Attack on Titan', 'Jujutsu Kaisen', 'One Piece', 'Demon Slayer', 'Blue Exorcist'].map((anime, i) => (
            <span
              key={i}
              className="text-[10px] md:text-xs tracking-widest uppercase text-violet-500/30 hover:text-primary/60 transition-colors duration-500 cursor-default font-display hidden md:inline-block"
            >
              {anime}
            </span>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="w-24 h-[1px] mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8" />

        {/* Copyright */}
        <p className="text-violet-500/25 text-xs tracking-[0.3em] uppercase font-display">
          &copy; {new Date().getFullYear()} Anime Legends. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
