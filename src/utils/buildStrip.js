import { getFilterCss } from './filters'
import { getFrame, drawFrameBackground, drawFrameDecorations } from './frames'
import { getLayout } from './layouts'
import { drawCover, loadImage } from './capture'

const STICKER_GLYPHS = {
  heart: '♥',
  star: '★',
  sparkle: '✦',
}

/**
 * Compose final image: background → photos → decorations → caption/date → stickers.
 */
export async function buildStrip({
  photos,
  frameId,
  layoutId,
  filterId,
  caption = '',
  showDate = true,
  stickers = [],
}) {
  const layout = getLayout(layoutId)
  const frame = getFrame(frameId)
  const canvas = document.createElement('canvas')
  canvas.width = layout.width
  canvas.height = layout.height
  const ctx = canvas.getContext('2d')

  drawFrameBackground(ctx, frame, layout.width, layout.height)

  const filterCss = getFilterCss(filterId)
  for (let i = 0; i < layout.slots.length; i++) {
    const slot = layout.slots[i]
    const src = photos[i]
    if (!src) continue
    const img = await loadImage(src)
    ctx.save()
    roundRectClip(ctx, slot.x, slot.y, slot.w, slot.h, 12)
    ctx.filter = filterCss
    drawCover(ctx, img, slot.x, slot.y, slot.w, slot.h)
    ctx.restore()
    // Thin inner border around each photo
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 3
    roundRect(ctx, slot.x, slot.y, slot.w, slot.h, 12)
    ctx.stroke()
  }

  drawFrameDecorations(ctx, frame, layoutId, layout.width, layout.height)

  const footerY = layout.height - (layoutId === 'polaroid' ? 120 : 90)
  ctx.fillStyle = frame.textColor
  ctx.textAlign = 'center'

  if (caption.trim()) {
    ctx.font = '600 32px Nunito, sans-serif'
    ctx.fillText(caption.trim(), layout.width / 2, footerY)
  }
  if (showDate) {
    ctx.font = '500 24px Nunito, sans-serif'
    ctx.globalAlpha = 0.85
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    ctx.fillText(dateStr, layout.width / 2, footerY + (caption.trim() ? 36 : 0))
    ctx.globalAlpha = 1
  }

  for (const s of stickers) {
    const gx = s.x * layout.width
    const gy = s.y * layout.height
    const size = (s.size ?? 0.04) * layout.width
    ctx.font = `${size}px Fredoka, sans-serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = s.color ?? frame.accent
    ctx.fillText(STICKER_GLYPHS[s.type] ?? '♥', gx, gy)
  }

  return canvas
}

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

function roundRectClip(ctx, x, y, w, h, r) {
  roundRect(ctx, x, y, w, h, r)
  ctx.clip()
}
