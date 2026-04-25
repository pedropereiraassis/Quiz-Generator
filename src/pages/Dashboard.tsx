import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Target, Trophy, Clock, CheckCircle2, ChevronRight, Edit3, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { useMemo } from 'react';

export default function Dashboard() {
  const { quizzes, attempts } = useStore();

  const stats = useMemo(() => {
    let totalScore = 0;
    let totalMaxScore = 0;
    attempts.forEach(a => {
      totalScore += a.score;
      totalMaxScore += a.maxScore;
    });

    return {
      quizzesCreated: quizzes.length,
      quizzesTaken: attempts.length,
      averageScore: totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0,
    };
  }, [quizzes, attempts]);

  return (
    <div className="space-y-8 relative z-10">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Target />}
          label="Quizzes Created"
          value={stats.quizzesCreated.toString()}
          color="from-blue-600 to-blue-800"
        />
        <StatCard
          icon={<CheckCircle2 />}
          label="Quizzes Taken"
          value={stats.quizzesTaken.toString()}
          color="from-green-600 to-green-800"
        />
        <StatCard
          icon={<Trophy />}
          label="Average Score"
          value={`${stats.averageScore}%`}
          color="from-purple-600 to-purple-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Quizzes */}
        <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Your Quizzes</h2>
            <Link to="/generate" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Create New</Link>
          </div>
          <div className="divide-y divide-white/5">
            {quizzes.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                You haven't created any quizzes yet.
              </div>
            ) : (
               quizzes.map(quiz => (
                 <div key={quiz.id} className="p-4 hover:bg-white/10 transition-colors flex items-center justify-between">
                   <div>
                     <h3 className="text-sm font-medium text-slate-100">{quiz.title}</h3>
                     <p className="text-[10px] text-slate-400">{quiz.questions.length} questions &bull; {new Date(quiz.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <Link to={`/quiz/${quiz.id}/edit`} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors ring-1 ring-transparent hover:ring-blue-500/20">
                       <Edit3 className="w-4 h-4" />
                     </Link>
                     <Link to={`/quiz/${quiz.id}/play`} className="p-2 text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                       <Play className="w-4 h-4" />
                     </Link>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>

        {/* Recent Attempts */}
        <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Attempts</h2>
          </div>
          <div className="divide-y divide-white/5">
            {attempts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No quiz attempts yet.
              </div>
            ) : (
                attempts.map(attempt => {
                  const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
                  
                  return (
                    <Link
                      key={attempt.id}
                      to={`/quiz/${attempt.quizId}/results/${attempt.id}`}
                      className="p-4 hover:bg-white/10 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center font-bold text-sm bg-gradient-to-br border border-white/10",
                          percentage >= 80 ? "from-green-500/20 to-green-600/20 text-green-400 ring-1 ring-green-500/30" :
                          percentage >= 50 ? "from-orange-500/20 to-orange-600/20 text-orange-400 ring-1 ring-orange-500/30" :
                          "from-red-500/20 to-red-600/20 text-red-400 ring-1 ring-red-500/30"
                        )}>
                          {percentage}%
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-slate-100">{attempt.quizTitle}</h3>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(attempt.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                    </Link>
                  )
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 backdrop-blur-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br", color)}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</div>
        <div className="text-2xl font-black text-white">{value}</div>
      </div>
    </div>
  );
}
