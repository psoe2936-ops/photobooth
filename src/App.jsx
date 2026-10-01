import { useCallback, useState } from 'react'
import FloatingDecor from './components/FloatingDecor'
import WelcomeScreen from './components/WelcomeScreen'
import ChooseScreen from './components/ChooseScreen'
import BoothScreen from './components/BoothScreen'
import ResultScreen from './components/ResultScreen'
import { FRAMES } from './utils/frames'

const DEFAULT_CHOICES = {
  frameId: FRAMES[0].id,
  layoutId: 'strip',
  filterId: 'normal',
  timerSec: 3,
}

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [transition, setTransition] = useState('in')
  const [choices, setChoices] = useState(DEFAULT_CHOICES)
  const [photos, setPhotos] = useState([])
  const [retakeIndex, setRetakeIndex] = useState(null)
  const [uploadMode, setUploadMode] = useState(false)
  const [caption, setCaption] = useState('')
  const [stickers, setStickers] = useState([])
  const [showDate, setShowDate] = useState(true)
  const [pickRetakeSlot, setPickRetakeSlot] = useState(false)

  const goTo = useCallback((next) => {
    setTransition('out')
    setTimeout(() => {
      setScreen(next)
      setTransition('in')
    }, 220)
  }, [])

  const patchChoices = (patch) => setChoices((c) => ({ ...c, ...patch }))

  const resetSession = () => {
    setChoices(DEFAULT_CHOICES)
    setPhotos([])
    setRetakeIndex(null)
    setUploadMode(false)
    setCaption('')
    setStickers([])
    setShowDate(true)
    setPickRetakeSlot(false)
  }

  const handleBoothDone = (finalPhotos) => {
    setPhotos(finalPhotos)
    setRetakeIndex(null)
    goTo('result')
  }

  const handleRetakeAll = () => {
    setPhotos([])
    setRetakeIndex(null)
    setUploadMode(false)
    goTo('booth')
  }

  const handleRetakeOne = () => {
    setPickRetakeSlot(true)
  }

  const confirmRetakeSlot = (index) => {
    setRetakeIndex(index)
    setPickRetakeSlot(false)
    setUploadMode(false)
    goTo('booth')
  }

  return (
    <div className="app-bg relative min-h-dvh overflow-x-hidden">
      <FloatingDecor />
      <main className={`screen-shell screen-${transition}`}>
        {screen === 'welcome' && (
          <WelcomeScreen onStart={() => goTo('choose')} />
        )}

        {screen === 'choose' && (
          <ChooseScreen
            choices={choices}
            onChange={patchChoices}
            onContinue={() => {
              setPhotos([])
              setRetakeIndex(null)
              setUploadMode(false)
              goTo('booth')
            }}
            onBack={() => goTo('welcome')}
          />
        )}

        {screen === 'booth' && (
          <BoothScreen
            choices={choices}
            photos={photos}
            setPhotos={setPhotos}
            retakeIndex={retakeIndex}
            uploadMode={uploadMode}
            onUploadMode={setUploadMode}
            onDone={handleBoothDone}
            onBack={() => goTo('choose')}
          />
        )}

        {screen === 'result' && !pickRetakeSlot && (
          <ResultScreen
            choices={choices}
            photos={photos}
            caption={caption}
            onCaptionChange={setCaption}
            stickers={stickers}
            onStickersChange={setStickers}
            showDate={showDate}
            onShowDateChange={setShowDate}
            onRetakeAll={handleRetakeAll}
            onRetakeOne={handleRetakeOne}
            onStartOver={() => {
              resetSession()
              goTo('welcome')
            }}
          />
        )}

        {screen === 'result' && pickRetakeSlot && (
          <RetakePicker
            photos={photos}
            onPick={confirmRetakeSlot}
            onCancel={() => setPickRetakeSlot(false)}
          />
        )}
      </main>
    </div>
  )
}

function RetakePicker({ photos, onPick, onCancel }) {
  return (
    <section className="flex flex-1 flex-col gap-4">
      <h2 className="font-display text-xl font-bold text-ink">Which photo?</h2>
      <p className="text-sm text-ink/70">Tap the slot you want to retake.</p>
      <div className="grid grid-cols-2 gap-3">
        {photos.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            className="overflow-hidden rounded-3xl border-4 border-pink/50 bg-white p-1 shadow-soft hover:scale-[1.02] active:scale-95"
          >
            {src ? (
              <img src={src} alt={`Retake photo ${i + 1}`} className="aspect-square w-full object-cover" />
            ) : (
              <span className="flex aspect-square items-center justify-center text-ink/40">{i + 1}</span>
            )}
            <span className="block py-2 font-display text-sm font-semibold">Photo {i + 1}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </section>
  )
}
