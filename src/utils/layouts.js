/** Export sizes and photo slot rectangles for each layout */
export const LAYOUTS = {
  strip: {
    id: 'strip',
    name: 'Classic Strip',
    width: 600,
    height: 1800,
    photoCount: 4,
    // Four stacked squares with padding
    slots: [
      { x: 48, y: 120, w: 504, h: 380 },
      { x: 48, y: 520, w: 504, h: 380 },
      { x: 48, y: 920, w: 504, h: 380 },
      { x: 48, y: 1320, w: 504, h: 380 },
    ],
  },
  grid: {
    id: 'grid',
    name: 'Grid 2×2',
    width: 1200,
    height: 1200,
    photoCount: 4,
    slots: [
      { x: 60, y: 100, w: 520, h: 520 },
      { x: 620, y: 100, w: 520, h: 520 },
      { x: 60, y: 640, w: 520, h: 520 },
      { x: 620, y: 640, w: 520, h: 520 },
    ],
  },
  polaroid: {
    id: 'polaroid',
    name: 'Polaroid',
    width: 900,
    height: 1100,
    photoCount: 1,
    slots: [{ x: 70, y: 70, w: 760, h: 760 }],
  },
}

export function getLayout(layoutId) {
  return LAYOUTS[layoutId] ?? LAYOUTS.strip
}
