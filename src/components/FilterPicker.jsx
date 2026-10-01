import { FILTERS } from '../utils/filters'

export default function FilterPicker({ value, onChange }) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-display text-lg font-semibold text-ink">Filter</legend>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={`min-h-12 rounded-full border-4 px-4 font-display text-sm font-semibold transition-transform hover:scale-105 active:scale-95 ${
              value === f.id
                ? 'border-deep-pink bg-deep-pink text-white'
                : 'border-pink/50 bg-white text-ink'
            }`}
            aria-pressed={value === f.id}
          >
            {f.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
