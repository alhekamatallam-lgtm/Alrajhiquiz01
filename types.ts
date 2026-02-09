
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}

export enum AppState {
  WELCOME = 'WELCOME',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  LEADERBOARD = 'LEADERBOARD'
}

export interface UserStats {
  name: string;
  score: number;
  totalQuestions: number;
  startTime: number;
  endTime?: number;
  totalTime: number; // Total seconds spent
  choices: Record<string, string>; // Map of Question Text -> Selected Answer Text
}
