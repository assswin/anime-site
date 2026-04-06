// src/utils/audioManager.js
// Singleton Audio Manager — YouTube IFrame API for BGM + Web Audio API for SFX

class AudioManager {
  constructor() {
    // Web Audio API (for SFX)
    this.context = null
    this.masterGain = null
    this.sfxCache = new Map()

    // YouTube Player (for BGM)
    this.ytPlayer = null
    this.ytReady = false
    this.ytApiLoaded = false
    this.pendingVideoId = null
    this.currentVideoId = null

    this.isMuted = false
    this.isInitialized = false
    this.bgmVolume = 60 // YouTube volume 0-100
  }

  init() {
    if (this.isInitialized) return

    // Initialize Web Audio API for SFX
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.context = new AudioContext()
    this.masterGain = this.context.createGain()
    this.masterGain.connect(this.context.destination)

    // Initialize YouTube IFrame API for BGM
    this._loadYouTubeAPI()
    this.isInitialized = true
  }

  _loadYouTubeAPI() {
    if (this.ytApiLoaded) return
    this.ytApiLoaded = true

    // Create hidden container for YT player
    const container = document.createElement('div')
    container.id = 'yt-bgm-container'
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:200px;height:200px;pointer-events:none;opacity:0;'
    const playerDiv = document.createElement('div')
    playerDiv.id = 'yt-bgm-player'
    container.appendChild(playerDiv)
    document.body.appendChild(container)

    // Load YT Iframe API script
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(tag, firstScript)

    // YT API calls this global function when ready
    window.onYouTubeIframeAPIReady = () => {
      this.ytPlayer = new window.YT.Player('yt-bgm-player', {
        height: '200',
        width: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          loop: 0,
        },
        events: {
          onReady: () => {
            this.ytReady = true
            this.ytPlayer.setVolume(this.isMuted ? 0 : this.bgmVolume)
            // If a video was requested before the player was ready, play it now
            if (this.pendingVideoId) {
              this._playYTVideo(this.pendingVideoId)
              this.pendingVideoId = null
            }
          },
          onStateChange: (event) => {
            // Loop the video when it ends
            if (event.data === window.YT.PlayerState.ENDED) {
              this.ytPlayer.seekTo(0)
              this.ytPlayer.playVideo()
            }
          },
          onError: (event) => {
            console.warn('YouTube Player Error:', event.data, '— Video ID:', this.currentVideoId)
          }
        }
      })
    }
  }

  _playYTVideo(videoId) {
    if (!this.ytPlayer || !this.ytReady) {
      this.pendingVideoId = videoId
      return
    }
    if (videoId === this.currentVideoId) return

    this.currentVideoId = videoId
    this.ytPlayer.loadVideoById({
      videoId: videoId,
      startSeconds: 0,
      suggestedQuality: 'small'
    })
    this.ytPlayer.setVolume(this.isMuted ? 0 : this.bgmVolume)
  }

  setMute(mute) {
    this.isMuted = mute

    // Mute/unmute Web Audio SFX
    if (this.masterGain && this.context) {
      this.masterGain.gain.setTargetAtTime(mute ? 0 : 1, this.context.currentTime, 0.1)
    }

    // Mute/unmute YouTube BGM
    if (this.ytPlayer && this.ytReady) {
      if (mute) {
        this.ytPlayer.setVolume(0)
      } else {
        this.ytPlayer.setVolume(this.bgmVolume)
      }
    }
  }

  // ========================
  // BGM — YouTube Playback
  // ========================
  async playBGM(url) {
    if (!this.isInitialized) this.init()

    // The `url` from character data is now a YouTube video ID
    // (e.g., "daFi4MScfl8" instead of "/assets/audio/luffy_theme.mp3")
    const videoId = url
    this._playYTVideo(videoId)
  }

  // ========================
  // SFX — Web Audio API
  // ========================
  async playSFX(url) {
    if (!this.isInitialized) this.init()
    if (this.context.state === 'suspended') {
      await this.context.resume()
    }

    try {
      let buffer = this.sfxCache.get(url)

      if (!buffer) {
        const response = await fetch(url)
        if (!response.ok) throw new Error("File not found")
        const arrayBuffer = await response.arrayBuffer()
        buffer = await this.context.decodeAudioData(arrayBuffer)
        this.sfxCache.set(url, buffer)
      }

      const source = this.context.createBufferSource()
      const sfxGain = this.context.createGain()

      source.buffer = buffer
      sfxGain.gain.setValueAtTime(0.4, this.context.currentTime)

      source.connect(sfxGain)
      sfxGain.connect(this.masterGain)

      source.start(0)
    } catch (e) {
      // Fallback: Synthesize a sound if file is missing
      this.createSynthSFX(url.includes('select') ? 'click' : 'swipe')
    }
  }

  // Procedural Sound Synthesis Fallback
  createSynthSFX(type) {
    if (!this.isInitialized) this.init()
    const osc = this.context.createOscillator()
    const envelope = this.context.createGain()

    osc.connect(envelope)
    envelope.connect(this.masterGain)

    const now = this.context.currentTime

    if (type === 'click') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.1)
      envelope.gain.setValueAtTime(0.3, now)
      envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.1)
    } else {
      // Swipe / Whoosh
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2)
      envelope.gain.setValueAtTime(0.1, now)
      envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.2)
    }
  }

  stopAll() {
    if (this.ytPlayer && this.ytReady) {
      this.ytPlayer.stopVideo()
      this.currentVideoId = null
    }
  }
}

export const audioManager = new AudioManager()
