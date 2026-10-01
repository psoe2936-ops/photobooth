/** Turn canvas into a File for sharing or download */
export async function canvasToFile(canvas, filename = 'photobooth.png') {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Could not create image')
  return new File([blob], filename, { type: 'image/png' })
}

/** Web Share API with files (mobile-friendly) */
export function canShareFile() {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false
  try {
    const test = new File([''], 't.png', { type: 'image/png' })
    return navigator.canShare({ files: [test] })
  } catch {
    return false
  }
}

export async function shareImage(file, title = 'Photobooth') {
  await navigator.share({
    files: [file],
    title,
    text: 'My photobooth picture!',
  })
}

/** Classic download via temporary link */
export function downloadImage(canvas, filename = 'photobooth.png') {
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
