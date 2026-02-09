
import React, { useState } from 'react';
import { RAJHI_LOGO } from '../constants';

interface WelcomeProps {
  onStart: (name: string) => void;
  onViewLeaderboard: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, onViewLeaderboard }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-8 page-transition px-4">
      {/* Decorative Elements */}
      <div className="relative w-full flex flex-col items-center">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-rajhi-blue/5 rounded-full blur-3xl -z-10"></div>
        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 transform rotate-3">
          <img src={RAJHI_LOGO} alt="Logo" className="w-16 h-16 object-contain -rotate-3" />
        </div>
        
        <h1 className="text-3xl font-black text-rajhi-blue text-center mb-2">
          مسابقة <span className="text-rajhi-gold">الأثر</span> والحوكمة
        </h1>
        <p className="text-gray-500 text-center font-medium">اللقاء الاجتماعي الأول 2026</p>
      </div>

      <div className="w-full glass-card rounded-[2.5rem] shadow-2xl shadow-rajhi-blue/10 p-8 border border-white/50">
        <p className="text-gray-600 text-center leading-relaxed mb-8">
          أهلاً بك في رحلة المعرفة. اختبر مهاراتك القيادية والتطويرية في القطاع غير الربحي.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-rajhi-blue focus:bg-white focus:outline-none transition-all text-lg font-bold text-center placeholder:font-normal"
              placeholder="اكتب اسمك للمشاركة..."
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-rajhi-blue to-rajhi-blue/90 text-white font-black rounded-2xl transition-all active:scale-95 text-xl shadow-xl shadow-rajhi-blue/20"
            >
              ابدأ الآن 🚀
            </button>

            <button
              type="button"
              onClick={onViewLeaderboard}
              className="w-full py-4 bg-white border-2 border-rajhi-gold/30 text-rajhi-gold font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span>قائمة المتصدرين</span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-3 text-rajhi-gold font-bold bg-rajhi-gold/10 px-6 py-2 rounded-full border border-rajhi-gold/20">
        <span className="text-lg">✨</span>
        <span className="text-sm">40 سؤالاً في التطوير المؤسسي</span>
      </div>
    </div>
  );
};

export default Welcome;
