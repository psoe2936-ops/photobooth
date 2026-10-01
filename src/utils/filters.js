/** Filter presets applied via canvas 2D context.filter */
export const FILTERS = [
  { id: 'normal', name: 'Normal', css: 'none' },
  { id: 'bw', name: 'Black & White', css: 'grayscale(1) contrast(1.05)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.35) saturate(1.2) brightness(1.05)' },
  { id: 'pink', name: 'Soft Pink', css: 'saturate(0.9) hue-rotate(-15deg) brightness(1.08)' },
]

export function getFilterCss(filterId) {
  return FILTERS.find((f) => f.id === filterId)?.css ?? 'none'
}
