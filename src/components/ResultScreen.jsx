import { useEffect, useState } from 'react'
import { buildStrip } from '../utils/buildStrip'
import { canvasToFile, canShareFile, downloadImage, shareImage } from '../utils/saveImage'
import Confetti from './Confetti'

const STICKER_TYPES = [
  { id: 'heart', label: 'Heart' },
  { id: 'star', label: 'Star' },
  { id: 'sparkle', label: 'Sparkle' },
]

export default function ResultScreen({
  choices,
  photos,
  caption,
  onCaptionChange,
  stickers,
  onStickersChange,
  showDate,
  onShowDateChange,
  onRetakeAll,
  onRetakeOne,
  onStartOver,
}) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const [building, setBuilding] = useState(true)
  const [shareError, setShareError] = useState(null)
  const canShare = canShareFile()

  useEffect(() => {
    let cancelled = false
    setBuilding(true)
    ;(async () => {
      const c = await buildStrip({
        photos,
        frameId: choices.frameId,
        layoutId: choices.layoutId,
        filterId: choices.filterId,
        caption,
        showDate,
        stickers,
      })
      if (cancelled) return
      setCanvas(c)
      setPreviewUrl(c.toDataURL('image/png'))
      setBuilding(false)
    })()
    return () => {
      cancelled = true
    }
  }, [photos, choices, caption, showDate, stickers])

  const handleDownload = () => {
    if (!canvas) return
    downloadImage(canvas, `photobooth-${Date.now()}.png`)
  }

  const handleShare = async () => {
    if (!canvas) return
    setShareError(null)
    try {
      const file = await canvasToFile(canvas, `photobooth-${Date.now()}.png`)
      await shareImage(file)
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setShareError('Sharing failed — try Download instead.')
        handleDownload()
      }
    }
  }

  const addSticker = (type) => {
    onStickersChange([
      ...stickers,
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        x: 0.2 + Math.random() * 0.6,
        y: 0.15 + Math.random() * 0.5,
        size: 0.05 + Math.random() * 0.03,
      },
    ])
  }

  return (
    <section className="flex flex-1 flex-col gap-4 pb-6">
      <Confetti active={!building && Boolean(previewUrl)} />

      <header className="text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Your picture!</h2>
        <p className="text-sm text-ink/70">Add a caption or stickers, then save.</p>
      </header>

      <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border-4 border-pink/50 bg-white p-2 shadow-soft-lg">
        {building ? (
          <p className="py-16 text-center text-ink/60">Building your strip…</p>
        ) : (
          <img
            src={previewUrl}
            alt="Final photobooth picture"
            className="mx-auto max-h-[55vh] w-auto rounded-2xl object-contain"
          />
        )}
      </div>

      <label className="block space-y-1">
        <span className="font-display text-sm font-semibold text-ink">Caption (optional)</span>
        <input
          type="text"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          maxLength={60}
          placeholder="Best day ever!"
          className="min-h-12 w-full rounded-3xl border-4 border-pink/40 bg-white px-4 font-sans text-ink shadow-soft focus:border-deep-pink"
        />
      </label>

      <label className="flex min-h-12 items-center gap-3">
        <input
          type="checkbox"
          checked={showDate}
          onChange={(e) => onShowDateChange(e.target.checked)}
          className="h-5 w-5 accent-deep-pink"
        />
        <span className="font-sans text-sm text-ink">Show date on strip</span>
      </label>

      <fieldset>
        <legend className="font-display text-sm font-semibold text-ink">Stickers</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {STICKER_TYPES.map((s) => (
            <button
              key={s.id}
              type="button"
              className="btn-secondary min-h-12 px-4 text-sm"
              onClick={() => addSticker(s.id)}
            >
              + {s.label}
            </button>
          ))}
          {stickers.length > 0 && (
            <button
              type="button"
              className="min-h-12 rounded-full border-4 border-pink/40 px-4 text-sm text-ink/70"
              onClick={() => onStickersChange([])}
            >
              Clear stickers
            </button>
          )}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3">
        {canShare && (
          <button type="button" className="btn-primary w-full" onClick={handleShare} disabled={building}>
            Save to Phone
          </button>
        )}
        <button type="button" className="btn-secondary w-full" onClick={handleDownload} disabled={building}>
          Download PNG
        </button>
        {!canShare && (
          <p className="text-center text-xs text-ink/60">
            On iPhone: after download, open the image and long-press to Save to Photos.
          </p>
        )}
        {shareError && <p className="text-center text-sm text-deep-pink">{shareError}</p>}
      </div>

      <div className="flex flex-col gap-2 border-t border-pink/30 pt-4">
        <button type="button" className="btn-secondary w-full" onClick={onRetakeAll}>
          Retake all
        </button>
        <button type="button" className="btn-secondary w-full" onClick={onRetakeOne}>
          Retake one photo
        </button>
        <button type="button" className="min-h-12 w-full font-display text-sm font-semibold text-ink/70 underline" onClick={onStartOver}>
          Start over
        </button>
      </div>
    </section>
  )
}
