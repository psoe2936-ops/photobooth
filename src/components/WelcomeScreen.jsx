export default function WelcomeScreen({ onStart }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="text-4xl motion-safe:animate-bounce" aria-hidden="true">
        ✨
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        Photobooth
      </h1>
      <p className="mt-3 max-w-sm font-sans text-lg text-ink/80">
        Pick a cute frame, strike a pose, and download your strip all in your browser.
      </p>
      <div className="mt-2 flex gap-2 text-2xl" aria-hidden="true">
        <span>♥</span>
        <span>★</span>
        <span>♥</span>
      </div>
      <button type="button" className="btn-primary mt-10 min-w-[200px]" onClick={onStart}>
        Start
      </button>
    </section>
  )
}
