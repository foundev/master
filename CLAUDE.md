# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based mastery-focused goal tracking application with time tracking functionality. Users can create goals, start/stop timers, and track total time spent on each goal. Built with TypeScript, React 18, and uses local storage for persistence.

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
- Uses Pico CSS framework via CDN
- Development mode includes sourcemaps and file watching

### Core Structure
- **Entry point**: `src/index.tsx` - React app initialization
- **Main component**: `src/App.tsx` - Root application component
- **State management**: Custom hooks pattern with `useGoals` hook
- **Data persistence**: Local storage utilities in `src/utils/storage.ts`

### Key Components
- `GoalForm` - Create new goals
- `GoalList` - Display all goals
- `GoalCard` - Individual goal with timer controls

### Data Flow
1. `useGoals` hook manages all goal state and operations
2. Goals stored in localStorage with time session tracking
3. Timer state persists across browser sessions
4. Time sessions logged separately for future analytics

### Types
- `Goal` - Core goal entity with time tracking fields
- `TimeSession` - Individual timing sessions for detailed tracking

### Testing
- Jest with jsdom environment
- Test setup in `src/setupTests.ts`
- Tests located in `src/__tests__/` and `*.test.ts` files
- **IMPORTANT**: Always run `npm test` after making code changes to ensure tests pass