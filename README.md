# Mastery

A comprehensive mastery-focused goal tracking application with advanced time tracking, analytics, and visualization features. Create goals with target hours, track time through live timers or manual entry, visualize progress with interactive charts, and receive intelligent completion estimates.

## Features

### 🎯 Goal Management
- Create goals with custom titles, descriptions, and target hour commitments
- Set realistic mastery targets (e.g., "Learn React: 100 hours", "Master Piano: 1000 hours")
- Visual progress tracking with percentage completion and remaining hours
- Goal deletion with confirmation and data loss warnings

### ⏱️ Time Tracking
- **Live Timer**: Start/stop functionality with persistent sessions across browser refreshes
- **Manual Time Entry**: Add time for past dates with comprehensive validation
- **Session History**: Detailed logging of all work sessions for analytics
- **Daily Limits**: Smart validation prevents unrealistic time entries (24-hour daily maximum across all projects)
- **Cross-Session Persistence**: Timers automatically resume after browser restart

### 📊 Analytics & Visualization
- **Interactive Progress Charts**: ECharts-powered visualizations showing daily time spent and cumulative progress
- **Completion Estimates**: Intelligent predictions based on recent work patterns using median calculation
- **Progress Modal**: Detailed statistics with visual progress tracking
- **Real-time Updates**: Live timer display with millisecond precision

### 💾 Data Management
- **Local Storage**: All data persisted locally in your browser for complete privacy
- **Session Tracking**: Individual work sessions stored for detailed analytics
- **Data Validation**: Comprehensive validation for time entries and goal creation
- **Export Ready**: Session data structured for future export capabilities

### 🎨 User Experience
- **Clean UI**: Minimal, responsive design using Pico CSS framework
- **Modal-based Interactions**: User-friendly overlays for detailed actions
- **Visual Feedback**: Animated error messages and progress indicators
- **Accessibility**: Proper form labels and keyboard navigation support

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

### Basic Workflow

1. **Create a Goal**: Use the form to add a new goal with:
   - Title (required)
   - Description (optional)
   - Target hours for mastery (required)

2. **Track Time**:
   - **Live Timer**: Click "Start Timer" to begin tracking, "Stop Timer" to end
   - **Manual Entry**: Click "Add Time" to log past work sessions with date selection

3. **Monitor Progress**:
   - View real-time progress bars and completion percentages
   - Click "Show Progress" for detailed analytics and interactive charts
   - See estimated completion dates based on your work patterns

4. **Manage Goals**:
   - Delete goals with confirmation dialogs
   - View total time invested before deletion

### Advanced Features

- **Daily Time Validation**: The app prevents logging more than 24 hours per day across all projects
- **Session Persistence**: Timers automatically resume if you close and reopen your browser
- **Progress Analytics**: View daily work patterns and cumulative progress over time
- **Intelligent Estimates**: Get completion date predictions based on your recent work velocity

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
│   ├── GoalCard.tsx    # Individual goal display with timer controls
│   ├── GoalForm.tsx    # Goal creation form
│   ├── GoalList.tsx    # Goal collection display
│   ├── GoalProgressChart.tsx  # ECharts visualization component
│   ├── Modal.tsx       # Reusable modal component
│   ├── AddTimeModal.tsx # Manual time entry with validation
│   └── ProgressModal.tsx # Detailed progress view
├── hooks/              # Custom React hooks
│   ├── useGoals.ts     # Goal state management
│   └── useTimer.ts     # Real-time timer functionality
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage operations
│   └── time.ts         # Time formatting and calculation helpers
├── __tests__/          # Test suites
│   ├── *.test.tsx      # Component tests
│   ├── *.test.ts       # Hook and utility tests
│   └── integration.test.tsx # Full application tests
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

### Technology Stack

- **React 18** - UI framework with hooks-based architecture
- **TypeScript** - Type safety and enhanced developer experience
- **ECharts** - Professional data visualization library
- **esbuild** - Fast bundling and development server
- **Jest** - Comprehensive testing framework with jsdom
- **Pico CSS** - Minimal, semantic CSS framework
- **Local Storage API** - Client-side data persistence

### Key Technical Features

- **Custom Hooks Pattern**: Clean separation of concerns with `useGoals` and `useTimer`
- **Persistent State**: Timer state survives browser refreshes and closures
- **Real-time Updates**: Millisecond-precision timer with live UI updates
- **Data Validation**: Comprehensive validation preventing unrealistic time entries
- **Interactive Charts**: Responsive ECharts integration with custom styling
- **Modal System**: Reusable modal components for enhanced UX
- **Session Analytics**: Intelligent completion predictions using statistical analysis

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.