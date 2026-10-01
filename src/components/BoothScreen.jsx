import { useCallback, useRef, useState } from 'react'
import { useCamera } from '../hooks/useCamera'
import { getLayout } from '../utils/layouts'
import { getFilterCss } from '../utils/filters'
import { captureFromVideo } from '../utils/capture'
import { playShutterSound } from '../utils/playShutter'
import Countdown from './Countdown'
import PhotoThumbs from './PhotoThumbs'

const PAUSE_BETWEEN_MS = 900

export default function BoothScreen({
  choices,
  photos,
  setPhotos,
  retakeIndex,
  uploadMode,
  onUploadMode,
  onDone,
  onBack,
}) {
  const layout = getLayout(choices.layoutId)
  const total = layout.photoCount
  const cameraOn = !uploadMode
  const { videoRef, status, error, start } = useCamera(cameraOn)

  const [countdown, setCountdown] = useState(null)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(false)
  const [recordingLight, setRecordingLight] = useState(false)
  const fileRef = useRef(null)
  const runningRef = useRef(false)

  const filterStyle = { filter: getFilterCss(choices.filterId) }

  const takeOneShot = useCallback(() => {
    const data = captureFromVideo(videoRef.current, { mirror: true })
    if (!data) return null
    playShutterSound()
    setFlash(true)
    setTimeout(() => setFlash(false), 120)
    return data
  }, [videoRef])

  const runSequence = useCallback(async () => {
    if (runningRef.current || uploadMode || status !== 'ready') return

    let working = [...photos]
    const shotsNeeded = retakeIndex != null ? 1 : total - working.length
    if (shotsNeeded <= 0) {
      onDone(working)
      return
    }

    runningRef.current = true
    setBusy(true)

    for (let n = 0; n < shotsNeeded; n++) {
      setRecordingLight(true)
      for (let t = choices.timerSec; t >= 1; t--) {
        setCountdown(t)
        await sleep(1000)
      }
      setCountdown(null)

      const shot = takeOneShot()
      setRecordingLight(false)
      if (shot) {
        if (retakeIndex != null) {
          working[retakeIndex] = shot
        } else {
          working = [...working, shot]
        }
        setPhotos([...working])
      }

      if (n < shotsNeeded - 1) await sleep(PAUSE_BETWEEN_MS)
    }

    setBusy(false)
    runningRef.current = false
    onDone(working)
  }, [
    uploadMode,
    status,
    photos,
    retakeIndex,
    total,
    choices.timerSec,
    takeOneShot,
    setPhotos,
    onDone,
  ])

  const handleShutter = () => {
    if (uploadMode || busy) return
    runSequence()
  }

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const need = retakeIndex != null ? 1 : total - photos.filter(Boolean).length
    const picked = files.slice(0, need)
    const readers = await Promise.all(
      picked.map(
        (file) =>
          new Promise((resolve) => {
            const r = new FileReader()
            r.onload = () => resolve(r.result)
            r.readAsDataURL(file)
          }),
      ),
    )

    let next = [...photos]
    if (retakeIndex != null && readers[0]) {
      while (next.length < total) next.push(null)
      next[retakeIndex] = readers[0]
    } else {
      next = [...next, ...readers].slice(0, total)
    }
    setPhotos(next)

    const complete =
      retakeIndex != null ? Boolean(next[retakeIndex]) : next.filter(Boolean).length >= total
    if (complete) onDone(next)
    e.target.value = ''
  }

  const openUpload = () => {
    onUploadMode(true)
    setTimeout(() => fileRef.current?.click(), 0)
  }

  const progress = photos.filter(Boolean).length

  return (
    <section className="flex flex-1 flex-col">
      <header className="mb-3 flex items-center justify-between">
        <button type="button" className="btn-secondary min-h-12 px-4 py-2 text-sm" onClick={onBack}>
          Back
        </button>
        <h2 className="font-display text-xl font-bold text-ink">Booth</h2>
        <div className="w-16" aria-hidden="true" />
      </header>

      <div className="booth-cabinet mx-auto w-full max-w-md p-4">
        <div className="booth-curtain" aria-hidden="true" />
        <div className="mb-2 flex items-center justify-end gap-2 px-2">
          <span className="text-xs font-display text-ink/70">REC</span>
          <span
            className={`h-3 w-3 rounded-full ${recordingLight || countdown ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-ink/20'}`}
            aria-hidden="true"
          />
        </div>

        <div className="relative overflow-hidden rounded-3xl border-4 border-ink/10 bg-black shadow-soft-lg">
          {!uploadMode && (
            <>
              {status === 'loading' && (
                <p className="flex aspect-[3/4] items-center justify-center text-white">Starting camera…</p>
              )}
              {status === 'error' && error && (
                <CameraError error={error} onUpload={openUpload} onRetry={start} />
              )}
              {status !== 'error' && status !== 'loading' && (
                <video
                  ref={videoRef}
                  className="aspect-[3/4] w-full scale-x-[-1] object-cover"
                  style={filterStyle}
                  playsInline
                  muted
                  autoPlay
                  aria-label="Live camera preview"
                />
              )}
              <Countdown value={countdown} />
              {flash && <div className="flash-overlay" aria-hidden="true" />}
            </>
          )}
          {uploadMode && (
            <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 bg-lavender/30 p-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">Upload mode</p>
              <p className="text-sm text-ink/70">
                Pick {retakeIndex != null ? 1 : Math.max(0, total - progress)} photo(s) from your gallery.
              </p>
              <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
                Choose files
              </button>
            </div>
          )}
        </div>

        <PhotoThumbs photos={photos} total={total} layoutId={choices.layoutId} />

        <div className="mt-4 flex flex-col items-center gap-3">
          {!uploadMode && status === 'ready' && (
            <button
              type="button"
              className="shutter-btn"
              onClick={handleShutter}
              disabled={busy}
              aria-label={busy ? 'Taking photos' : 'Take photos'}
            />
          )}
          {uploadMode && progress < total && (
            <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
              Add photos
            </button>
          )}
          {(error?.code === 'notfound' || error?.code === 'denied') && !uploadMode && (
            <button type="button" className="btn-secondary w-full" onClick={openUpload}>
              Upload photos instead
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={retakeIndex == null && total > 1}
        className="sr-only"
        onChange={handleFiles}
      />
    </section>
  )
}

function CameraError({ error, onUpload, onRetry }) {
  return (
    <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 bg-cream p-6 text-center">
      <p className="font-display text-lg font-bold text-ink">{error.title || 'Oops'}</p>
      <p className="text-sm text-ink/80">{error.message}</p>
      {error.steps && (
        <ol className="list-inside list-decimal text-left text-sm text-ink/70">
          {error.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
      <div className="mt-2 flex w-full flex-col gap-2">
        {error.code === 'denied' && (
          <button type="button" className="btn-secondary" onClick={onRetry}>
            Try again
          </button>
        )}
        <button type="button" className="btn-primary" onClick={onUpload}>
          Upload photos
        </button>
      </div>
    </div>
  )
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
