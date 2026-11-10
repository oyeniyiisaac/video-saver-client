# Video Saver Client

The frontend web client for **Video Saver**, built with React, Vite, Tailwind CSS, and Axios.

## Features

- **Single Page Architecture**: Clean, responsive, single-page application without unnecessary routing.
- **Minimal Dark UI**: Styled with Tailwind CSS, Emerald accents, and Space Grotesk / Inter typography.
- **Real-Time Progress Tracking**: Shows "Preparing..." during backend extraction/conversion and switches to an accurate percentage progress bar during file streaming.
- **Format & Quality Picker**: Dynamic quality dropdown generated from available stream heights (e.g., 1080p, 720p, 480p) or one-click MP3 audio extraction.
- **Robust Error Handling**: Centralized Axios interceptor translates network timeouts, CORS issues, rate limits (429), and server errors into friendly inline notices.
- **Independent Project**: Completely decoupled from `video-saver-server`. Communicates strictly over standard HTTP REST requests.

## Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

- `VITE_API_URL`: The base URL pointing to the running `video-saver-server` API.

## Local Development

```bash
npm install
npm run dev
```

Vite dev server will start on [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
npm run build
```

This compiles static assets into the `dist/` folder.

## Deployment Notes

Since the client is a static Single Page Application (SPA), it can be deployed on any static hosting platform:

- **Vercel**: Import the `video-saver-client` directory, Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`.
- **Netlify**: Set base directory to `video-saver-client`, Publish directory to `dist`.
- **Cloudflare Pages**: Connect repo, set build command to `npm run build` and output to `dist`.

### Connecting with Server

1. Set the client environment variable `VITE_API_URL` to your backend's deployed URL (e.g. `https://api.yourdomain.com/api`).
2. Update the backend server's `CLIENT_URL` to the exact public URL of this client (e.g. `https://video-saver.vercel.app`) to ensure CORS requests are allowed.
