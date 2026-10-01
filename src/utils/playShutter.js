let audioEl = null

/** Short camera click — uses mp3 if present, else a tiny Web Audio blip */
export function playShutterSound() {
  try {
    if (!audioEl) {
      audioEl = new Audio('/shutter.mp3')
      audioEl.volume = 0.5
    }
    audioEl.currentTime = 0
    const p = audioEl.play()
    if (p?.catch) {
      p.catch(() => playBeep())
    }
  } catch {
    playBeep()
  }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.08)
  } catch {
    /* silent fail */
  }
}
