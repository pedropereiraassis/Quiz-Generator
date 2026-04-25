import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Save, Plus, Trash2, ArrowLeft, Play } from 'lucide-react';
import { Quiz, QuizQuestion } from '../types';

export default function QuizEdit() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, updateQuiz, deleteQuiz } = useStore();
  
  const originalQuiz = useMemo(() => quizzes.find(q => q.id === quizId), [quizzes, quizId]);
  const [quiz, setQuiz] = useState<Quiz | null>(originalQuiz || null);

  if (!quiz) {
    return <div className="text-center py-12">Quiz not found</div>;
  }

  const handleSave = () => {
    updateQuiz(quiz.id, {
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions
    });
    navigate(`/quiz/${quiz.id}/play`);
  };

  const handleQuestionChange = (qIndex: number, field: string, value: any) => {
    const updated = [...quiz.questions];
    updated[qIndex] = { ...updated[qIndex], [field]: value };
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...quiz.questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[oIndex] = { ...newOptions[oIndex], text: value };
    updated[qIndex] = { ...updated[qIndex], options: newOptions };
    setQuiz({ ...quiz, questions: updated });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(quiz.id);
      navigate('/');
    }
  };

  const toggleCorrectOption = (qIndex: number, optionId: string) => {
    const updated = [...quiz.questions];
    const correctIds = [...updated[qIndex].correctOptionIds];
    
    if (correctIds.includes(optionId)) {
      // Don't allow removing the last correct option
      if (correctIds.length > 1) {
        updated[qIndex].correctOptionIds = correctIds.filter(id => id !== optionId);
      }
    } else {
      updated[qIndex].correctOptionIds = [...correctIds, optionId];
    }
    
    setQuiz({ ...quiz, questions: updated });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex gap-4">
          <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-500/10 hover:ring-1 hover:ring-red-500/20 rounded-xl transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all">
            <Play className="w-4 h-4" />
            <span>Save & Play</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
        <h1 className="text-xl font-bold mb-6 tracking-tight">Edit Quiz Details</h1>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={e => setQuiz({...quiz, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
            <textarea
              value={quiz.description}
              onChange={e => setQuiz({...quiz, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder-slate-500 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, qIndex) => (
          <div key={q.id} className="bg-slate-900/60 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center justify-between">
              <span>Question {qIndex + 1}</span>
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Question Text</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Options (Check correct answers)</label>
                <div className="space-y-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={opt.id} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={q.correctOptionIds.includes(opt.id)}
                        onChange={() => toggleCorrectOption(qIndex, opt.id)}
                        className="w-5 h-5 accent-blue-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder-slate-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Explanation</label>
                <textarea
                  value={q.explanation}
                  onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder-slate-500 min-h-[80px]"
                  placeholder="Explain why the answer is correct..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
