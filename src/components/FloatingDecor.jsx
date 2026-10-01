/** Gentle floating hearts and stars behind the app */
export default function FloatingDecor() {
  const items = [
    { char: '♥', className: 'float-a left-[8%] top-[12%] text-pink', delay: '0s' },
    { char: '★', className: 'float-b left-[85%] top-[18%] text-lavender', delay: '1s' },
    { char: '✦', className: 'float-c left-[15%] top-[70%] text-peach', delay: '2s' },
    { char: '♥', className: 'float-b left-[78%] top-[65%] text-deep-pink/70', delay: '0.5s' },
    { char: '★', className: 'float-a left-[50%] top-[8%] text-mint', delay: '1.5s' },
  ]

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className={`absolute text-2xl opacity-40 ${item.className} decor-float`}
          style={{ animationDelay: item.delay }}
        >
          {item.char}
        </span>
      ))}
    </div>
  )
}
