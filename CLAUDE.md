# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based mastery-focused goal tracking application with comprehensive time tracking and analytics functionality. Users can create goals with target hours, track time through live timers or manual entry, visualize progress with interactive charts, and receive intelligent completion estimates. Built with TypeScript, React 18, ECharts for data visualization, and uses local storage for persistence.

## Commands

### Development
- `npm run dev` - Start development server with file watching (rebuilds on change)
- `npm run build` - Production build (creates optimized `dist/index.html`)

### Testing
- `npm test` - Run all tests with Jest
- `npm run test:watch` - Run tests in watch mode

## Architecture

### Build System
- Custom esbuild-based build system (`build.js`)
- Single-file output: bundles all JS/CSS into `dist/index.html`
- Uses Pico CSS framework via CDN for styling
- ECharts library integration for data visualization
- Development mode includes sourcemaps and file watching

### Core Structure
- **Entry point**: `src/index.tsx` - React app initialization
- **Main component**: `src/App.tsx` - Root application component
- **State management**: Custom hooks pattern with `useGoals` hook
- **Data persistence**: Local storage utilities in `src/utils/storage.ts`

### Key Components
- `GoalForm` - Create new goals with title, description, and target hours
- `GoalList` - Display all goals in a responsive grid layout
- `GoalCard` - Individual goal display with timer controls, progress tracking, and action buttons
- `Modal` - Reusable modal component for overlays
- `AddTimeModal` - Manual time entry with date selection and daily limit validation
- `ProgressModal` - Detailed progress view with interactive charts and statistics
- `GoalProgressChart` - ECharts-powered visualization showing daily/cumulative progress

### Data Flow
1. `useGoals` hook manages all goal state and operations
2. `useTimer` hook handles real-time timer display and persistence
3. Goals stored in localStorage with time session tracking
4. Timer state persists across browser sessions
5. Time sessions logged separately for analytics and charting
6. Daily time validation ensures realistic usage patterns

### Types
- `Goal` - Core goal entity with time tracking fields (id, title, description, totalHours, totalTimeSpent, isActive, startTime, createdAt)
- `TimeSession` - Individual timing sessions for detailed tracking (goalId, startTime, endTime, duration)

### Core Features

#### Goal Management
- Create goals with custom titles, descriptions, and target hour commitments
- Set realistic mastery targets (e.g., "Learn React: 100 hours")
- Visual progress tracking with percentage completion
- Goal deletion with confirmation and data loss warnings

#### Time Tracking
- **Live Timer**: Start/stop functionality with persistent sessions across browser refreshes
- **Manual Time Entry**: Add time for past dates with built-in validation
- **Session History**: Detailed logging of all work sessions
- **Daily Limits**: Prevents unrealistic time entries (24-hour daily maximum across all projects)

#### Analytics & Visualization
- **Progress Charts**: Interactive ECharts showing daily time spent and cumulative progress
- **Completion Estimates**: AI-powered predictions based on recent work patterns
- **Progress Modal**: Detailed statistics and visual progress tracking
- **Real-time Updates**: Live timer display with millisecond precision

#### Data Management
- **Local Storage**: All data persisted locally for privacy
- **Cross-session Persistence**: Timers resume automatically after browser restart
- **Data Validation**: Comprehensive validation for time entries and goal creation
- **Session Tracking**: Individual work sessions stored for detailed analytics

### Testing
- Jest with jsdom environment
- Test setup in `src/setupTests.ts`
- Tests located in `src/__tests__/` and `*.test.ts` files
- **IMPORTANT**: Always run `npm test` after making code changes to ensure tests pass

### Time Tracking & Validation
- **Daily Limit**: Maximum 24 hours per day across ALL projects combined
- Validation prevents users from exceeding realistic daily time limits
- Manual time entry includes cross-project validation with clear error messaging
- Time sessions are stored per goal but validated globally per day

## Development Guidelines

### UI/UX Rules
- **NEVER use `alert()`, `confirm()`, or `prompt()`** - Use proper React components with styled error messages instead
- Error messages should be informative and user-friendly with proper styling
- Use visual feedback (colors, animations) for better user experience