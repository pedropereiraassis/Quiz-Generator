import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateQuiz } from '../lib/gemini';

export default function QuizGenerate() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addQuiz } = useStore();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const newQuizData = await generateQuiz(topic);
      const savedQuiz = addQuiz(newQuizData);
      navigate(`/quiz/${savedQuiz.id}/edit`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-slate-900/60 rounded-3xl border border-white/5 p-10 backdrop-blur-sm relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Generate a new quiz</h1>
          <p className="text-sm text-slate-400">Enter any topic and AI will create a multi-choice quiz for you.</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            Quiz Topic
          </label>
          <input
            id="topic"
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-100 placeholder-slate-500"
            placeholder="e.g. World War II History, Quantum Physics, Taylor Swift"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            required
          />
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gathering info and writing questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
