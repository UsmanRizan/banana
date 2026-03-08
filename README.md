<div align="center">
<img width="1200" height="475" alt="Banana Football Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Banana Football

A real-time multiplayer puzzle-based football game where players solve math challenges to execute football moves and score goals. Combine strategy, speed, and problem-solving to win!

## Features

- **Puzzle-Based Gameplay**: Solve image-based math puzzles to unlock football actions (passes, shots, etc.)
- **Progressive Attack Phases**: Build your attack from initiation through to the final strike
- **Difficulty Levels**: Choose between Easy (30s), Medium (20s), or Hard (10s) puzzle time limits
- **Real-Time Timer**: 60-second matches with live countdown
- **Multiplayer Support**: Play cross-device with friends on the same local network
- **Score Tracking**: Accumulate goals and compete for the highest score

## Prerequisites

- **Node.js** (v18 or higher)

## Setup & Installation

### Install Dependencies

```bash
npm install
```

## Running the Game

### Single Device (Local Play)

```bash
npm run dev
```

Open your browser to `http://localhost:5173` and enjoy!

### Multiplayer (Two Devices on Same Network)

For cross-device multiplayer, you'll need to run the Socket.io backend server:

#### Terminal 1 (Start the server):

```bash
cd server
npm install
npm start
```

#### Terminal 2 (Start the frontend):

```bash
npm run dev
```

#### Connecting Players:

1. **Find your local IP address**:
   - Windows: Open PowerShell and run `ipconfig` (look for IPv4 Address like `192.168.1.x`)
   - Mac/Linux: Run `ifconfig` or `hostname -I`

2. **Device 1**: Open `http://localhost:5173`, create a match, and copy the session code

3. **Device 2**: Open `http://[YOUR_LOCAL_IP]:5173`, join the match with the session code from Device 1

For detailed server configuration, see [server/README.md](server/README.md).

## Development

### Available Scripts

- `npm run dev` — Start the development server with hot reload
- `npm run build` — Build the project for production
- `npm run lint` — Run TypeScript type checking
- `npm run preview` — Preview the production build locally

### Tech Stack

- **React** 19.2.4 — UI framework
- **TypeScript** 5.8 — Type-safe programming
- **Vite** 6.2 — Build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **Banana Math API** — Image-based puzzle generation

### Project Structure

```
├── components/          # React UI components
│   ├── ActionCard.tsx   # Displays available football actions
│   ├── GameplayScreen.tsx # Main game board
│   ├── PuzzleModal.tsx   # Math puzzle interface
│   ├── JoinScreen.tsx    # Player join/setup screen
│   └── FinishedScreen.tsx # Game over/results screen
├── hooks/              # Custom React hooks
│   ├── useGameLogic.ts # Game state logic
│   ├── useGameState.ts # Player state management
│   ├── useMatchTimer.ts # Countdown timer logic
│   └── useActionOptions.ts # Action availability logic
├── services/           # External API integration
│   └── bananaApiService.ts # Banana Math API (puzzles)
├── App.tsx             # Root component
├── constants.tsx       # Game configuration constants
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
└── index.html          # HTML entry point
```

## Troubleshooting

### Port Already in Use

- If port 5173 is in use, Vite will automatically use the next available port
- For multiplayer, ensure the server port (default 3000) is not blocked by your firewall

### Multiplayer Connection Issues

- Both devices must be on the same network/subnet
- Ensure firewalls allow connections on the server port
- Double-check the session code for typos
