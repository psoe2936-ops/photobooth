# Photobooth

A cute, browser-only photobooth: pick a frame, take photos with your camera, and download or share the result. **Nothing is uploaded** — photos stay on your device.

## Requirements

- **Node.js** 18+
- **HTTPS or localhost** for the camera (`getUserMedia`) and for **Save to Phone** (Web Share API). Use `npm run dev` locally or deploy to Vercel for phone testing.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`). Allow camera access when prompted.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this project to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Your site will be `https://your-project.vercel.app` — use that URL on your phone for camera and sharing.

Optional: install the [Vercel CLI](https://vercel.com/docs/cli), run `vercel` in the project folder, and follow the prompts.

## Project structure

- `src/components/` — screens and UI pieces
- `src/hooks/useCamera.js` — camera lifecycle and errors
- `src/utils/frames.js` — frame styles (add new frames here)
- `src/utils/buildStrip.js` — final canvas composition
- `src/utils/saveImage.js` — download and Web Share helpers

## Sound

Shutter sound loads from `/public/shutter.mp3` if present; otherwise a short Web Audio beep plays.
