import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Quiz, QuizAttempt } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Quiz;
  updateQuiz: (id: string, updates: Partial<Omit<Quiz, 'id' | 'createdAt'>>) => void;
  deleteQuiz: (id: string) => void;
  addAttempt: (attempt: Omit<QuizAttempt, 'id' | 'createdAt'>) => QuizAttempt;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const stored = localStorage.getItem('quizzes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const stored = localStorage.getItem('attempts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('attempts', JSON.stringify(attempts));
  }, [attempts]);

  const addQuiz = useCallback((quiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: uuidv4(),
      createdAt: Date.now(),
      questions: quiz.questions.map(q => ({ ...q, id: q.id || uuidv4() }))
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    return newQuiz;
  }, []);

  const updateQuiz = useCallback((id: string, updates: Partial<Omit<Quiz, 'id' | 'createdAt'>>) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  }, []);

  const deleteQuiz = useCallback((id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    setAttempts(prev => prev.filter(a => a.quizId !== id));
  }, []);

  const addAttempt = useCallback((attempt: Omit<QuizAttempt, 'id' | 'createdAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    setAttempts(prev => [newAttempt, ...prev]);
    return newAttempt;
  }, []);

  return (
    <AppContext.Provider value={{ quizzes, attempts, addQuiz, updateQuiz, deleteQuiz, addAttempt }}>
      {children}
    </AppContext.Provider>
  );
}

export function useStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useStore must be used within an AppProvider');
  }
  return context;
}
