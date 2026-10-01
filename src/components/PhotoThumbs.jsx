/** Shows progress: thumbnails of shots taken so far */
export default function PhotoThumbs({ photos, total, layoutId }) {
  const slots = Array.from({ length: total }, (_, i) => photos[i] ?? null)
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <p className="font-display text-sm font-semibold text-ink/80">
        {photos.length} of {total}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {slots.map((src, i) => (
          <div
            key={i}
            className={`h-14 w-14 overflow-hidden rounded-2xl border-4 ${
              src ? 'border-deep-pink/50' : 'border-pink/30 bg-white/50'
            }`}
          >
            {src ? (
              <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-ink/40">{i + 1}</span>
            )}
          </div>
        ))}
      </div>
      {layoutId === 'polaroid' && (
        <p className="text-xs text-ink/60">One perfect shot!</p>
      )}
    </div>
  )
}
