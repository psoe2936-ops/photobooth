/**
 * Frame styles — add a new frame by pushing one object to FRAMES.
 * Drawing runs after photos: background → photos → decorations → text (in buildStrip).
 */

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.scale(size / 24, size / 24)
  ctx.beginPath()
  ctx.moveTo(12, 21)
  ctx.bezierCurveTo(4, 14, 0, 10, 0, 6)
  ctx.bezierCurveTo(0, 2, 3, 0, 6, 0)
  ctx.bezierCurveTo(8, 0, 10, 1, 12, 3)
  ctx.bezierCurveTo(14, 1, 16, 0, 18, 0)
  ctx.bezierCurveTo(21, 0, 24, 2, 24, 6)
  ctx.bezierCurveTo(24, 10, 20, 14, 12, 21)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawStar(ctx, x, y, r, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.translate(x, y)
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    const b = a + Math.PI / 5
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    ctx.lineTo(Math.cos(b) * (r * 0.45), Math.sin(b) * (r * 0.45))
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawSparkle(ctx, x, y, size, color) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = size / 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x, y + size)
  ctx.moveTo(x - size, y)
  ctx.lineTo(x + size, y)
  ctx.moveTo(x - size * 0.7, y - size * 0.7)
  ctx.lineTo(x + size * 0.7, y + size * 0.7)
  ctx.moveTo(x + size * 0.7, y - size * 0.7)
  ctx.lineTo(x - size * 0.7, y + size * 0.7)
  ctx.stroke()
  ctx.restore()
}

function drawCloud(ctx, x, y, scale, color) {
  ctx.save()
  ctx.fillStyle = color
  const r = 18 * scale
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.arc(x + r * 0.9, y - r * 0.3, r * 0.75, 0, Math.PI * 2)
  ctx.arc(x + r * 1.7, y, r * 0.85, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/** Shared: draw background fill and outer border */
export function drawFrameBackground(ctx, frame, width, height) {
  ctx.fillStyle = frame.background
  ctx.fillRect(0, 0, width, height)

  if (frame.border) {
    ctx.strokeStyle = frame.border.color
    ctx.lineWidth = frame.border.width
    roundRect(ctx, frame.border.inset, frame.border.inset, width - frame.border.inset * 2, height - frame.border.inset * 2, frame.border.radius)
    ctx.stroke()
  }
}

/** Frame-specific decorations on top of photos */
export function drawFrameDecorations(ctx, frame, layoutId, width, height) {
  const fn = DECORATORS[frame.id]
  if (fn) fn(ctx, layoutId, width, height, frame)
}

const DECORATORS = {
  'pink-hearts': (ctx, layoutId, w, h, frame) => {
    const hearts = [
      [40, 40, 22],
      [w - 50, 55, 18],
      [w / 2, 75, 16],
    ]
    hearts.forEach(([x, y, s]) => drawHeart(ctx, x, y, s, frame.accent))
    if (layoutId === 'strip') {
      ;[280, 680, 1080, 1480].forEach((y) => drawHeart(ctx, w - 36, y, 14, frame.accent))
    }
    ctx.fillStyle = frame.textColor
    ctx.font = '600 28px Fredoka, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('♥ Photobooth ♥', w / 2, h - 48)
  },

  'cream-polaroid': (ctx, layoutId, w, h, frame) => {
    ctx.strokeStyle = frame.accent
    ctx.lineWidth = 3
    roundRect(ctx, 36, 36, w - 72, h - 72, 12)
    ctx.stroke()
    if (layoutId === 'polaroid') {
      ctx.fillStyle = frame.textColor
      ctx.font = 'italic 32px Nunito, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('memories', w / 2, h - 80)
    }
  },

  'lavender-stars': (ctx, _layoutId, w, h, frame) => {
    ;[
      [50, 50, 14],
      [w - 60, 70, 12],
      [80, h - 60, 10],
      [w - 90, h - 50, 16],
      [w / 2, 40, 11],
    ].forEach(([x, y, r]) => drawStar(ctx, x, y, r, frame.accent))
    ctx.fillStyle = frame.textColor
    ctx.font = '600 26px Fredoka, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('✦ starry snaps ✦', w / 2, h - 44)
  },

  'mint-clouds': (ctx, _layoutId, w, h, frame) => {
    drawCloud(ctx, 70, 55, 1.1, frame.accent)
    drawCloud(ctx, w - 100, 65, 0.9, frame.accent)
    drawCloud(ctx, w / 2, h - 70, 1, 'rgba(255,255,255,0.85)')
    ctx.fillStyle = frame.textColor
    ctx.font = '600 24px Fredoka, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('fluffy day', w / 2, h - 42)
  },

  'film-bw': (ctx, layoutId, w, h, frame) => {
    // Film sprocket holes on left and right
    ctx.fillStyle = frame.accent
    const holeW = 28
    const holeH = 36
    const cols = layoutId === 'grid' ? 8 : 12
    for (let i = 0; i < cols; i++) {
      const y = 40 + i * ((h - 80) / cols)
      ctx.fillRect(8, y, holeW, holeH)
      ctx.fillRect(w - 8 - holeW, y, holeW, holeH)
    }
    ctx.fillStyle = frame.textColor
    ctx.font = '700 22px Fredoka, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FILM STRIP', w / 2, h - 36)
  },

  'peach-sparkle': (ctx, _layoutId, w, h, frame) => {
    ;[
      [45, 45, 16],
      [w - 55, 48, 14],
      [w / 2 - 80, 60, 12],
      [w / 2 + 90, 55, 15],
      [60, h - 55, 13],
      [w - 70, h - 60, 17],
    ].forEach(([x, y, s]) => drawSparkle(ctx, x, y, s, frame.accent))
    ctx.fillStyle = frame.textColor
    ctx.font = '600 26px Fredoka, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('✨ sparkle booth ✨', w / 2, h - 46)
  },
}

export const FRAMES = [
  {
    id: 'pink-hearts',
    name: 'Pink Hearts',
    background: '#FFE8F0',
    accent: '#FF7FA5',
    textColor: '#5A3E4B',
    border: { color: '#FFB6C8', width: 10, inset: 16, radius: 24 },
    preview: '#FFB6C8',
  },
  {
    id: 'cream-polaroid',
    name: 'Cream Polaroid',
    background: '#FFF8F0',
    accent: '#FFD9B8',
    textColor: '#5A3E4B',
    border: { color: '#FFD9B8', width: 8, inset: 20, radius: 8 },
    preview: '#FFF8F0',
  },
  {
    id: 'lavender-stars',
    name: 'Lavender Stars',
    background: '#EDE4FF',
    accent: '#B89EFF',
    textColor: '#5A3E4B',
    border: { color: '#D9C8FF', width: 10, inset: 18, radius: 28 },
    preview: '#D9C8FF',
  },
  {
    id: 'mint-clouds',
    name: 'Mint Clouds',
    background: '#E8FAF2',
    accent: '#A8E6CF',
    textColor: '#5A3E4B',
    border: { color: '#C8F2E0', width: 10, inset: 18, radius: 32 },
    preview: '#C8F2E0',
  },
  {
    id: 'film-bw',
    name: 'Classic Film',
    background: '#1a1a1a',
    accent: '#f5f5f5',
    textColor: '#f5f5f5',
    border: { color: '#444', width: 6, inset: 44, radius: 4 },
    preview: '#333',
  },
  {
    id: 'peach-sparkle',
    name: 'Peach Sparkle',
    background: '#FFF0E0',
    accent: '#FF9E6D',
    textColor: '#5A3E4B',
    border: { color: '#FFD9B8', width: 10, inset: 16, radius: 26 },
    preview: '#FFD9B8',
  },
]

export function getFrame(frameId) {
  return FRAMES.find((f) => f.id === frameId) ?? FRAMES[0]
}

/** Mini preview for frame picker cards */
export function drawFramePreview(canvas, frame) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  drawFrameBackground(ctx, frame, w, h)
  drawFrameDecorations(ctx, frame, 'strip', w, h)
}
