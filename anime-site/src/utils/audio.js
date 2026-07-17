class AudioManager {
  constructor() {
    this.ctx = null
    this.initialized = false
    this.masterGain = null
  }

  init() {
    // AudioContext can only be started after a user gesture
    if (this.initialized) return

    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.3 // Global volume 30%
      this.masterGain.connect(this.ctx.destination)
      this.initialized = true
    } catch (e) {
      console.error("Web Audio API not supported", e)
    }
  }

  // Suspense-building deep low-pass whoosh when expanding card
  playWhoosh() {
    if (!this.initialized || !this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    
    // Frequency drop
    osc.frequency.setValueAtTime(150, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.5)

    // Filter sweep
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.8)

    // Volume envelope
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.1)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.8)
  }

  // Futuristic UI tick when horizontally scrolling past a card
  playTick() {
    if (!this.initialized || !this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }

  // Crystal chime during Kanji convergence in intro
  playChime() {
    if (!this.initialized || !this.ctx) return

    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    // Harmonic bell tones
    osc1.type = 'sine'
    osc2.type = 'sine'
    osc1.frequency.setValueAtTime(1200, this.ctx.currentTime)
    osc2.frequency.setValueAtTime(1800, this.ctx.currentTime)

    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.masterGain)

    osc1.start()
    osc2.start()
    osc1.stop(this.ctx.currentTime + 2.0)
    osc2.stop(this.ctx.currentTime + 2.0)
  }
  // Intense charging hum before unlock
  playChargeUp() {
    if (!this.initialized || !this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(30, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 1.0)

    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 1.0)

    osc.connect(gain)
    gain.connect(this.masterGain)

    osc.start()
    osc.stop(this.ctx.currentTime + 1.0)
  }

  // Dramatic energetic explosion flash
  playExplosion() {
    if (!this.initialized || !this.ctx) return

    // Noise buffer for explosion
    const bufferSize = this.ctx.sampleRate * 2
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(8000, this.ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1.5)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    noise.start()
  }
}

// Singleton instance
export const audioManager = new AudioManager()
