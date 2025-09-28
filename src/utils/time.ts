import { Goal, TimeSession } from '../types';

export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const calculateEstimatedCompletion = (goal: Goal, sessions: TimeSession[]): Date | null => {
  const goalSessions = sessions.filter(session => session.goalId === goal.id);

  if (goalSessions.length < 2) {
    return null;
  }

  const recentSessions = goalSessions
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 7);

  const dailyHours = recentSessions.reduce((acc, session, index) => {
    const sessionDate = new Date(session.startTime).toDateString();
    const sessionHours = session.duration / (1000 * 60 * 60);

    if (!acc[sessionDate]) {
      acc[sessionDate] = 0;
    }
    acc[sessionDate] += sessionHours;
    return acc;
  }, {} as Record<string, number>);

  const dailyValues = Object.values(dailyHours);
  if (dailyValues.length === 0) return null;

  dailyValues.sort((a, b) => a - b);
  const medianHoursPerDay = dailyValues.length % 2 === 0
    ? (dailyValues[dailyValues.length / 2 - 1] + dailyValues[dailyValues.length / 2]) / 2
    : dailyValues[Math.floor(dailyValues.length / 2)];

  if (medianHoursPerDay <= 0) return null;

  const remainingHours = goal.totalHours - (goal.totalTimeSpent / (1000 * 60 * 60));
  if (remainingHours <= 0) return null;

  const daysToComplete = Math.ceil(remainingHours / medianHoursPerDay);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysToComplete);

  return completionDate;
};