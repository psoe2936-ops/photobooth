import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Start/stop the front camera. Cleans up tracks on unmount.
 */
export function useCamera(enabled) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const requestRef = useRef(0) // id of the latest start/stop call
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)

  const stop = useCallback(() => {
    requestRef.current += 1 // cancel any camera request still waiting
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setStatus('idle')
  }, [])

  const start = useCallback(async () => {
    const myRequest = ++requestRef.current
    setError(null)

    if (!window.isSecureContext) {
      setStatus('error')
      setError({
        code: 'insecure',
        title: 'Not secure',
        message: 'Camera needs HTTPS or localhost. Open the site on a secure URL.',
      })
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setError({
        code: 'unsupported',
        title: 'Camera not supported',
        message: 'Your browser does not support the camera API. Try Chrome or Safari.',
      })
      return
    }

    setStatus('loading')
    try {
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
      } catch (firstErr) {
        if (firstErr?.name === 'NotAllowedError') throw firstErr
        // Try again with the simplest setting
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      }

      // An old request finished late: turn this camera off and stop here
      if (myRequest !== requestRef.current) {
        stream.getTracks().forEach((t) => t.stop())
        return
      }

      streamRef.current = stream
      const video = videoRef.current
      if (video) {
        video.srcObject = stream
        try {
          await video.play()
        } catch (playErr) {
          console.warn('video.play() failed:', playErr)
        }
      }
      setStatus('ready')
    } catch (err) {
      if (myRequest !== requestRef.current) return
      console.error('Camera error:', err?.name, err?.message)
      setStatus('error')
      const name = err?.name || 'Error'
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError({
          code: 'denied',
          title: 'Camera blocked',
          message: 'Please allow camera access for this site.',
          steps: [
            'Tap the lock or camera icon in the address bar.',
            'Set Camera to Allow.',
            'Refresh the page and try again.',
          ],
        })
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError({
          code: 'notfound',
          title: 'No camera found',
          message: 'We could not find a camera on this device.',
          steps: ['Use Upload photos instead, or connect a webcam.'],
        })
      } else {
        setError({
          code: 'unknown',
          title: 'Camera problem',
          message: err?.message || 'Something went wrong starting the camera.',
          steps: ['Try closing other apps that use the camera, then refresh.'],
        })
      }
    }
  }, [])

  useEffect(() => {
    if (enabled) start()
    else stop()
    return () => stop()
  }, [enabled, start, stop])

  return { videoRef, status, error, start, stop }
}