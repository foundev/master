export interface Goal {
  id: string;
  title: string;
  description: string;
  totalTimeSpent: number;
  isActive: boolean;
  startTime?: number;
  createdAt: number;
}

export interface TimeSession {
  goalId: string;
  startTime: number;
  endTime: number;
  duration: number;
}