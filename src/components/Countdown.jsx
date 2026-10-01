/** Big number shown over the video during countdown */
export default function Countdown({ value }) {
  if (value == null) return null
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      aria-live="polite"
      aria-label={`${value} seconds`}
    >
      <span className="font-display text-8xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] motion-safe:animate-pulse">
        {value}
      </span>
    </div>
  )
}
