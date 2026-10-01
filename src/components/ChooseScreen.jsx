import FramePicker from './FramePicker'
import FilterPicker from './FilterPicker'
import { LAYOUTS } from '../utils/layouts'

export default function ChooseScreen({ choices, onChange, onContinue, onBack }) {
  const layoutOptions = Object.values(LAYOUTS)

  return (
    <section className="flex flex-1 flex-col gap-6 pb-4">
      <header>
        <h2 className="font-display text-2xl font-bold text-ink">Make it yours</h2>
        <p className="text-ink/70">Choose frame, layout, filter, and timer.</p>
      </header>

      <FramePicker value={choices.frameId} onChange={(v) => onChange({ frameId: v })} />

      <fieldset className="space-y-2">
        <legend className="font-display text-lg font-semibold text-ink">Layout</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {layoutOptions.map((layout) => (
            <button
              key={layout.id}
              type="button"
              onClick={() => onChange({ layoutId: layout.id })}
              className={`min-h-12 flex-1 rounded-3xl border-4 px-4 py-3 font-display text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95 sm:min-w-[140px] ${
                choices.layoutId === layout.id
                  ? 'border-deep-pink bg-white shadow-soft-lg'
                  : 'border-pink/40 bg-white/80'
              }`}
              aria-pressed={choices.layoutId === layout.id}
            >
              {layout.name}
              <span className="block text-xs font-normal text-ink/60">
                {layout.photoCount} photo{layout.photoCount > 1 ? 's' : ''}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <FilterPicker value={choices.filterId} onChange={(v) => onChange({ filterId: v })} />

      <fieldset className="space-y-2">
        <legend className="font-display text-lg font-semibold text-ink">Timer</legend>
        <div className="flex gap-3">
          {[3, 5].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onChange({ timerSec: sec })}
              className={`min-h-12 min-w-[88px] rounded-full border-4 font-display font-semibold transition-transform hover:scale-105 active:scale-95 ${
                choices.timerSec === sec
                  ? 'border-deep-pink bg-deep-pink text-white'
                  : 'border-pink/50 bg-white text-ink'
              }`}
              aria-pressed={choices.timerSec === sec}
            >
              {sec}s
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-secondary flex-1" onClick={onBack}>
          Back
        </button>
        <button type="button" className="btn-primary flex-1" onClick={onContinue}>
          Open booth
        </button>
      </div>
    </section>
  )
}
