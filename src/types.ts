export interface BaseEntity {
  id: string;
  createdAt: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionIds: string[];
  explanation: string;
}

export interface Quiz extends BaseEntity {
  title: string;
  description: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt extends BaseEntity {
  quizId: string;
  quizTitle: string;
  answers: Record<string, string[]>; // questionId -> selectedOptionIds
  score: number;
  maxScore: number;
}
