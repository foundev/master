# Goal Tracker

A simple, elegant goal tracking application with built-in time tracking functionality. Create goals, track time spent working on them, and monitor your progress over time.

## Features

- **Goal Management**: Create and organize your personal goals
- **Time Tracking**: Start/stop timers to track time spent on each goal
- **Persistent Storage**: All data saved locally in your browser
- **Session History**: Detailed tracking of individual work sessions
- **Clean UI**: Minimal, responsive design using Pico CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd goal-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `dist/index.html` in your browser

## Usage

1. **Create a Goal**: Use the form to add a new goal with a title and description
2. **Start Tracking**: Click "Start Timer" on any goal to begin tracking time
3. **Stop Tracking**: Click "Stop Timer" to end the current session
4. **View Progress**: See total time spent on each goal
5. **Manage Goals**: Delete goals you no longer need

## Development

### Available Scripts

- `npm run dev` - Start development mode with file watching
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode

### Project Structure

```
src/
├── components/          # React components
│   ├── GoalCard.tsx    # Individual goal display
│   ├── GoalForm.tsx    # Goal creation form
│   └── GoalList.tsx    # Goal collection display
├── hooks/              # Custom React hooks
│   ├── useGoals.ts     # Goal state management
│   └── useTimer.ts     # Timer functionality
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage operations
│   └── time.ts         # Time formatting helpers
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

### Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **esbuild** - Fast bundling and development
- **Jest** - Testing framework
- **Pico CSS** - Minimal CSS framework

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.