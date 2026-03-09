# MuAno - Web-Based Music Sequencer

MuAno is a web-based music sequencing application built with React, Vite, TypeScript, and TailwindCSS. It allows users to arrange notes on a piano roll, play them back through a synthesized audio engine, and manage complex music theory features like automatic timeline scrolling and real-time state manipulation.

## Features

- **Piano Roll Interface**: A complete timeline grid mapped to standard piano keys.
- **Note Manipulation**: Intuitive drag-to-create notes on the grid.
- **Playback Engine**: High-fidelity sound synthesis via [Tone.js](https://tonejs.github.io/).
- **Dynamic Timeline Auto-Scrolling**: The timeline view automatically tracks and scrolls with the playhead during playback so notes remain in view.
- **Robust State Management**: Powered by [Zustand](https://github.com/pmndrs/zustand), ensuring snappy updates.
- **Undo / Redo capabilities**: Complete time-travel through edit history managed by [zundo](https://github.com/charkour/zundo).
- **File Import / Export**: Save your arrangements to JSON and load them back in later.

## Technology Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Audio Synthesis**: [Tone.js](https://tonejs.github.io/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **State History**: [zundo](https://github.com/charkour/zundo)

## Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run lint` - Lints the codebase using ESLint.

## Getting Started

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Start Development Server**:

    ```bash
    npm run dev
    ```

3. **Open in Browser**: Navigate to `http://localhost:5173` (or the URL provided in your console).

## Architecture

The project strictly follows a TDD approach with Vitest. Architecture priorities heavily emphasize DRY/SOLID principles, React component modularity, strict parameter typing, and externalizing audio state updates from the primary React render loop for peak playback performance (e.g. subscribing directly to the `useAppStore` in our timeline container).
