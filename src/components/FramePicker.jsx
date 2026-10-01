import { useEffect, useRef } from 'react'
import { FRAMES, drawFramePreview } from '../utils/frames'

export default function FramePicker({ value, onChange }) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-display text-lg font-semibold text-ink">Frame</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FRAMES.map((frame) => (
          <FrameCard
            key={frame.id}
            frame={frame}
            selected={value === frame.id}
            onSelect={() => onChange(frame.id)}
          />
        ))}
      </div>
    </fieldset>
  )
}

function FrameCard({ frame, selected, onSelect }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) drawFramePreview(canvasRef.current, frame)
  }, [frame])

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-3xl border-4 p-2 text-left transition-transform hover:scale-[1.02] active:scale-95 ${
        selected ? 'border-deep-pink bg-white shadow-soft-lg' : 'border-pink/40 bg-white/80 shadow-soft'
      }`}
      aria-pressed={selected}
    >
      <canvas ref={canvasRef} width={120} height={160} className="mx-auto w-full rounded-2xl" aria-hidden="true" />
      <span className="mt-2 block text-center font-display text-sm font-semibold text-ink">{frame.name}</span>
    </button>
  )
}
