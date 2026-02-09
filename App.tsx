
import React, { useState, useCallback } from 'react';
import { AppState, UserStats } from './types';
import { QUESTIONS, RAJHI_LOGO } from './constants';
import Welcome from './components/Welcome';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [userStats, setUserStats] = useState<UserStats>({
    name: '',
    score: 0,
    totalQuestions: QUESTIONS.length,
    startTime: 0,
    totalTime: 0,
    choices: {}
  });

  const handleStart = useCallback((name: string) => {
    setUserStats(prev => ({ 
      ...prev, 
      name, 
      startTime: Date.now(), 
      choices: {},
      totalTime: 0 
    }));
    setAppState(AppState.QUIZ);
  }, []);

  const handleFinish = useCallback((finalScore: number, finalChoices: Record<string, string>, totalSeconds: number) => {
    setUserStats(prev => ({ 
      ...prev, 
      score: finalScore, 
      choices: finalChoices,
      totalTime: totalSeconds,
      endTime: Date.now() 
    }));
    setAppState(AppState.RESULTS);
  }, []);

  const handleRestart = useCallback(() => {
    setUserStats({
      name: '',
      score: 0,
      totalQuestions: QUESTIONS.length,
      startTime: 0,
      totalTime: 0,
      choices: {}
    });
    setAppState(AppState.WELCOME);
  }, []);

  const showLeaderboard = useCallback(() => {
    setAppState(AppState.LEADERBOARD);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#001a35] text-white overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl z-50 flex justify-between items-center border-b border-gray-100 shadow-md">
        <img src={RAJHI_LOGO} alt="Rajhi Humanitarian" className="h-10 md:h-14 object-contain" />
        <div className="text-[#001a35] font-bold text-sm md:text-base text-left">
          اللقاء الاجتماعي الأول 2026
        </div>
      </header>

      <main className="w-full max-w-2xl mt-24 mb-24 flex flex-col items-center justify-center animate-fade-in relative z-10">
        {appState === AppState.WELCOME && <Welcome onStart={handleStart} onViewLeaderboard={showLeaderboard} />}
        {appState === AppState.QUIZ && <Quiz questions={QUESTIONS} onFinish={handleFinish} />}
        {appState === AppState.RESULTS && <Results stats={userStats} onRestart={handleRestart} onViewLeaderboard={showLeaderboard} />}
        {appState === AppState.LEADERBOARD && <Leaderboard onBack={handleRestart} />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-[#001a35]/95 backdrop-blur-md text-center border-t border-white/5 flex flex-col gap-1">
        <div className="text-[10px] text-gray-400 font-medium">
          © 2026 مؤسسة الراجحي الإنسانية - محور الأثر والحوكمة
        </div>
        <div className="text-[11px] font-bold tracking-wide">
          <span className="text-gray-500">Powerd By</span> <span className="text-rajhi-gold">Abdelaziz Frhat</span>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
