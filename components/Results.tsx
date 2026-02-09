
import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';

interface ResultsProps {
  stats: UserStats;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

const Results: React.FC<ResultsProps> = ({ stats, onRestart, onViewLeaderboard }) => {
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const percentage = Math.round((stats.score / stats.totalQuestions) * 100);
  
  const getFeedback = () => {
    if (percentage >= 90) return "أنت خبير استراتيجي حقيقي!";
    if (percentage >= 70) return "رائع! لديك رؤية تطويرية عميقة.";
    if (percentage >= 50) return "أداء جيد، استمر في النمو.";
    return "بداية موفقة، التعلم رحلة مستمرة.";
  };

  const getRankIcon = () => {
    if (percentage >= 90) return "💎";
    if (percentage >= 70) return "🏆";
    if (percentage >= 50) return "🥇";
    return "💡";
  };

  useEffect(() => {
    const submitResults = async () => {
      const endpoint = "https://script.google.com/macros/s/AKfycbwLGBHt18RkcAkvp76a72mT7aWkmEwt-3cLNBkDnAm3as3VfXWTIOKoS6efJtIKep2FpA/exec";
      const payload = { "المتسابق": stats.name, ...stats.choices, "النقاط": stats.score, "الوقت": stats.totalTime };
      try {
        await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        setSubmitStatus('success');
      } catch (e) {
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    };
    submitResults();
  }, [stats]);

  return (
    <div className="w-full page-transition px-4 space-y-6">
      <div className="glass-card rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rajhi-blue to-rajhi-gold"></div>
        
        <div className="text-7xl mb-4 animate-bounce">{getRankIcon()}</div>
        
        <h2 className="text-3xl font-black text-rajhi-blue mb-1">شكراً لك!</h2>
        <p className="text-lg text-rajhi-gold font-bold mb-8">{stats.name}</p>

        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-50/80 p-5 rounded-[2rem] border border-white">
            <div className="text-3xl font-black text-rajhi-blue">{stats.score}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">نقطة</div>
          </div>
          <div className="bg-gray-50/80 p-5 rounded-[2rem] border border-white">
            <div className="text-3xl font-black text-rajhi-gold">{stats.totalTime}ث</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">وقت</div>
          </div>
        </div>

        <div className="w-full bg-rajhi-blue/5 p-6 rounded-2xl mb-6 border border-rajhi-blue/10">
          <p className="text-rajhi-blue font-bold leading-relaxed">
            "{getFeedback()}"
          </p>
        </div>

        <div className="w-full text-sm font-bold flex items-center justify-center gap-2">
          {isSubmitting ? (
             <div className="flex items-center text-gray-400">
               <div className="w-3 h-3 border-2 border-rajhi-blue border-t-transparent rounded-full animate-spin ml-2"></div>
               جاري الحفظ...
             </div>
          ) : (
             <div className="text-green-600 flex items-center">
               <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
               </svg>
               تم تسجيل النتيجة
             </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="w-full py-5 bg-rajhi-blue text-white font-black rounded-2xl shadow-xl shadow-rajhi-blue/20 active:scale-95 transition-all text-lg"
        >
          العودة للرئيسية
        </button>
        <button
          onClick={onViewLeaderboard}
          className="w-full py-4 bg-white border-2 border-rajhi-gold/30 text-rajhi-gold font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span>عرض الترتيب</span>
        </button>
      </div>
    </div>
  );
};

export default Results;
