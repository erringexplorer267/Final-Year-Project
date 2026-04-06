<!-- Copilot / AI agent instructions for the Antenna Digital Twin project -->
# Project snapshot

This repo implements a small digital-twin dashboard: a Flask backend that streams a live camera feed and exposes simple telemetry, and a Vite + React frontend that visualizes antenna polar plots and meter readings.

**Key files**
- [app.py](app.py#L1-L200): Flask server; routes `/video_feed` (MJPEG) and `/get_data` JSON. Contains the core mapping from OCR-reading -> `gain_db` and `theta` update.
- [reader.py](reader.py#L1-L200): Frame preprocessing and OCR (`pytesseract`); ROI and thresholding logic live here (important if you change OCR behavior).
- [vite.config.ts](vite.config.ts#L1-L200): Dev proxy: `/api/*` -> `http://127.0.0.1:5000` (rewrites `/api` prefix). Frontend requests use `/api/...` and rely on this proxy in dev.
- [src/hooks/useOrchestrator.ts](src/hooks/useOrchestrator.ts#L1-L200): Polls `/api/get_data` (500ms) and merges new `polar_data` points by `theta`. Update here if backend payload changes.
- [src/App.tsx](src/App.tsx#L1-L200): Dashboard layout and control buttons; references the live image at `/api/video_feed`.
- [src/components/PolarPlotter.tsx](src/components/PolarPlotter.tsx#L1-L200): Expects `antennaData` shape: `{ plot_metadata, polar_data: [{angle, gain_db}], analysis }`.
- [package.json](package.json#L1-L50): `npm run dev` (Vite), `npm run build` (tsc + vite build). Backend is run separately (`python app.py`).

Operational notes for an AI agent
- Big picture: the backend reads frames, extracts numeric readings via `reader.process_frame`, converts them into numeric `current_v`, then computes `gain_db = round((val * 0.4) - 40, 2)` and increments `theta` (see [app.py](app.py#L1-L200)). The frontend expects telemetry via the proxy (`/api/get_data`) and an MJPEG feed at `/api/video_feed`.
- Dev workflow: Run the Flask server on port 5000 and run `npm run dev` for the frontend. Vite proxies `/api` to Flask so components can use `/api/*` URLs. Example:

  - Start Flask: `python app.py` (binds to 127.0.0.1:5000)
  - Start frontend: `npm run dev`

- Environment details: `reader.py` sets `pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'`. Ensure Tesseract is installed at that path or update it before running OCR.

Concrete patterns and constraints
- Telemetry shape: backend `/get_data` returns `{ current_v, theta, gain_db, timestamp }`. `useOrchestrator` expects `gain_db` and `theta` and will append `{angle: theta, gain_db}` to `polar_data` if not duplicate.
- Avoid changing the `/api` URL surface without updating `vite.config.ts` and `src/hooks/useOrchestrator.ts`.
- RGBA and scale choices in `PolarPlotter` assume `gain_db` ranges [-40, 0]; if you change normalization, update `PolarPlotter` options (min/max in `r` scale).
- OCR ROI: `reader.py` uses a hard-coded center box: x in [0.3w,0.7w], y in [0.4h,0.6h]. If UI or camera framing changes, adjust that box for more reliable reads.

What an AI agent should do when editing code
- When changing telemetry fields: update both producer ([app.py](app.py#L1-L200)) and consumer (`src/hooks/useOrchestrator.ts` and `src/components/PolarPlotter.tsx`). Use the same property names.
- When modifying OCR preprocessing, validate visually by running Flask and checking the MJPEG stream at `/api/video_feed` in the browser (frontend will show connection errors in-place when the image fails to load).
- When tuning polling or rate limits: `useOrchestrator` polls every 500ms. If you change backend sample rate, align the frontend polling interval.

Quick checks and gotchas
- CORS is permissive in `app.py` (CORS(app, resources={r"/*": {"origins": "*"}})), but dev uses Vite proxy so CORS rarely matters during development.
- No tests are present; small edits should be validated by running `python app.py` + `npm run dev` and visually confirming the stream and plot.
- Styling uses Tailwind (see [tailwind.config.js](tailwind.config.js#L1-L40)). Keep component classes consistent with the app's theme.

If something's unclear
- Ask for which area to expand (OCR, telemetry schema, frontend dataflow, or build/run). I can add example payloads, unit-test suggestions, or a small end-to-end checklist.

— End of agent guidance —