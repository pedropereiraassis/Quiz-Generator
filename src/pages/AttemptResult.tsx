import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Trophy, ArrowLeft, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AttemptResult() {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const { quizzes, attempts } = useStore();
  
  const quiz = useMemo(() => quizzes.find(q => q.id === quizId), [quizzes, quizId]);
  const attempt = useMemo(() => attempts.find(a => a.id === attemptId), [attempts, attemptId]);
  
  if (!quiz || !attempt) {
    return <div className="text-center py-12">Results not found</div>;
  }

  const percentage = Math.round((attempt.score / attempt.maxScore) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/60 rounded-3xl border border-white/5 backdrop-blur-sm text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-6 border-4 border-slate-900 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Quiz Completed!</h1>
        <p className="text-slate-400 mb-8 font-medium">You scored {attempt.score} out of {attempt.maxScore} <span className={cn("px-2 py-0.5 rounded text-xs ml-2 font-bold", percentage >= 80 ? "bg-green-500/20 text-green-400" : percentage >= 50 ? "bg-orange-500/20 text-orange-400" : "bg-red-500/20 text-red-400")}>{percentage}%</span></p>
        
        <div className="flex items-center gap-4">
          <Link to={`/`} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2 text-slate-100">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <Link to={`/quiz/${quiz.id}/play`} className="px-8 py-3 bg-blue-600 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2 text-white">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>
        </div>
      </div>

      {/* Answers Review */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-12 mb-6">Review Answers</h2>
      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const selectedOptionIds = attempt.answers[question.id] || [];
          const correctOptionIds = question.correctOptionIds;
          const isCorrect = selectedOptionIds.length === correctOptionIds.length && selectedOptionIds.every(id => correctOptionIds.includes(id));
          
          return (
            <div key={question.id} className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 backdrop-blur-sm space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-slate-100 mb-6 leading-snug">
                    {index + 1}. {question.text}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {question.options.map(option => {
                      const isSelected = selectedOptionIds.includes(option.id);
                      const isOptionCorrect = correctOptionIds.includes(option.id);
                      
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "p-5 rounded-2xl border flex flex-col gap-2 transition-all",
                            isOptionCorrect && isSelected ? "bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(74,222,128,0.1)] text-slate-100" :
                            isOptionCorrect && !isSelected ? "bg-green-500/5 border-green-500/30 ring-1 ring-green-500/20 text-slate-100" :
                            isSelected && !isOptionCorrect ? "bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(248,113,113,0.1)] text-slate-100" :
                            "bg-white/5 border-white/10 text-slate-300 opacity-60"
                          )}
                        >
                          <span className="text-sm font-medium">{option.text}</span>
                          {(isOptionCorrect || isSelected) && (
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider", isOptionCorrect && isSelected ? "text-green-400" : isOptionCorrect && !isSelected ? "text-green-500" : "text-red-400")}>
                              {isOptionCorrect ? 'Correct Answer' : (isSelected ? 'Your Answer' : '')}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-6 p-5 bg-gradient-to-b from-blue-600/10 to-transparent border border-white/5 rounded-2xl flex flex-col gap-2">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Topic Insights</h3>
                       <div className="text-xs text-slate-400 italic leading-relaxed underline decoration-blue-500/30 underline-offset-4">
                         "{question.explanation}"
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
