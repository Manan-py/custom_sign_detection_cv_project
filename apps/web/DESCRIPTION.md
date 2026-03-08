## Manan's Project — Web App Description

### Overview
A Vite + React (HashRouter) app focused on:
- Hand Pose visualization with MediaPipe
- Custom Sign recorder and gallery (front‑end only right now)

Removed: ISL Recognition and backend (PocketBase) integrations.

### Requirements
- Node 18+ (or 20+), npm 9+

### Install and Run
- From repo root:
  - `npm install`
  - `npm run dev`
- Open: `http://localhost:3000`
- Routes (HashRouter):
  - `#/` — Home
  - `#/hand-pose` — MediaPipe Hand Pose
  - `#/custom-recorder` — Record a custom sign
  - `#/custom-gallery` — View your custom signs (UI only)

### Build and Preview
- Build: `npm run build --workspace web`
- Preview (prod build): `npm run start --workspace web` → opens on a free port near 4173

### Storage Status
- Storage is currently disabled. The recorder shows an alert and navigates to the gallery without saving.
- To enable saving, choose one:
  - Local only: Implement IndexedDB (e.g., `idb`) to persist frames and metadata.
  - Backend: Re-enable PocketBase and wire `custom_signs` CRUD.

### Tech Notes
- Styling: TailwindCSS via PostCSS (`postcss.config.cjs`), config in `tailwind.config.js`.
- UI: Radix UI primitives (dialog, toast, etc.) wrapped in local components.
- MediaPipe: `@mediapipe/tasks-vision` loaded from CDN for the hand-pose page.
- Routing: `HashRouter` to avoid dev-server/history issues.

### Troubleshooting
- White screen in dev: hard refresh (Cmd+Shift+R). Check console for module export errors; components now use default exports consistently.
- Port in use: stop prior servers or run on a different port.

### Next Steps (optional)
- Implement IndexedDB persistence for recorder and gallery.
- Re-introduce authentication and remote storage if needed.
