import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export default function QuizPlay() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, addAttempt } = useStore();
  
  const quiz = useMemo(() => quizzes.find(q => q.id === quizId), [quizzes, quizId]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  
  if (!quiz) {
    return <div className="text-center py-12">Quiz not found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isMultipleSelect = currentQuestion.correctOptionIds.length > 1;
  const currentSelections = answers[currentQuestion.id] || [];

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => {
      const selections = prev[currentQuestion.id] || [];
      let newSelections: string[];
      
      if (isMultipleSelect) {
        if (selections.includes(optionId)) {
          newSelections = selections.filter(id => id !== optionId);
        } else {
          newSelections = [...selections, optionId];
        }
      } else {
        newSelections = [optionId];
      }
      
      return { ...prev, [currentQuestion.id]: newSelections };
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finish Quiz
      submitQuiz();
    }
  };

  const submitQuiz = () => {
    let score = 0;
    let maxScore = quiz.questions.length;

    quiz.questions.forEach(q => {
      const selected = answers[q.id] || [];
      const correct = q.correctOptionIds;
      
      // Calculate score per question
      // 1 point if completely correct, 0 otherwise
      const isCorrect = selected.length === correct.length && selected.every(id => correct.includes(id));
      if (isCorrect) score += 1;
    });

    const attempt = addAttempt({
      quizId: quiz.id,
      quizTitle: quiz.title,
      answers,
      score,
      maxScore
    });

    navigate(`/quiz/${quiz.id}/results/${attempt.id}`);
  };

  const progress = Math.round(((currentQuestionIndex) / quiz.questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/60 p-10 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {isMultipleSelect && <span className="px-2 py-0.5 bg-blue-500 text-[10px] font-bold rounded uppercase tracking-tighter text-white">Multiple Answer</span>}
            {!isMultipleSelect && <span className="px-2 py-0.5 bg-purple-500 text-[10px] font-bold rounded uppercase tracking-tighter text-white">Single Answer</span>}
          </div>
          <h2 className="text-2xl font-medium leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map(option => {
            const isSelected = currentSelections.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={cn(
                  "p-5 rounded-2xl cursor-pointer group flex items-start gap-4 transition-all text-left",
                  isSelected 
                    ? "bg-blue-500/10 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)] text-slate-100" 
                    : "bg-white/5 border border-white/10 hover:bg-blue-500/5 hover:border-blue-500/40 text-slate-300"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                  isSelected
                    ? "bg-blue-500 border-2 border-blue-500"
                    : "border-2 border-white/20 group-hover:border-blue-500/50"
                 )}>
                  {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                <div>
                  <div className="text-sm font-medium">{option.text}</div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleNext}
            disabled={currentSelections.length === 0}
            className="px-10 py-3 bg-blue-600 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-white"
          >
            <span>{currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
