/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './store';
import Dashboard from './pages/Dashboard';
import QuizGenerate from './pages/QuizGenerate';
import QuizPlay from './pages/QuizPlay';
import QuizEdit from './pages/QuizEdit';
import AttemptResult from './pages/AttemptResult';
import { BrainCircuit } from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <header className="h-20 flex items-center px-10 border-b border-white/5 gap-6 backdrop-blur-xl relative z-10 bg-slate-900/40">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-colors">
            <BrainCircuit className="w-6 h-6 text-blue-400" />
            <span>QUIZ.GEN</span>
          </Link>
          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/generate" className="text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">New Quiz</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<QuizGenerate />} />
            <Route path="/quiz/:quizId/play" element={<QuizPlay />} />
            <Route path="/quiz/:quizId/edit" element={<QuizEdit />} />
            <Route path="/quiz/:quizId/results/:attemptId" element={<AttemptResult />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

