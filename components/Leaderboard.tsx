
import React, { useEffect, useState } from 'react';

interface Entry {
  "المتسابق": string;
  "النقاط": string | number;
  "الوقت": string | number;
}

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [data, setData] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwLGBHt18RkcAkvp76a72mT7aWkmEwt-3cLNBkDnAm3as3VfXWTIOKoS6efJtIKep2FpA/exec");
        const json = await response.json();
        
        if (json.ok && Array.isArray(json.data)) {
          // Sort by Score (Desc), then Time (Asc)
          const sorted = json.data
            .filter((item: any) => item["المتسابق"] && item["المتسابق"].trim() !== "")
            .sort((a: any, b: any) => {
              const scoreA = Number(a["النقاط"] || 0);
              const scoreB = Number(b["النقاط"] || 0);
              const timeA = Number(a["الوقت"] || 9999);
              const timeB = Number(b["الوقت"] || 9999);

              if (scoreA !== scoreB) {
                return scoreB - scoreA; // Higher score first
              }
              return timeA - timeB; // Lower time first if scores are tied
            });
          setData(sorted);
        } else {
          setError("فشل تحميل البيانات");
        }
      } catch (err) {
        setError("تعذر الاتصال بقاعدة البيانات");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return {
        card: "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white shadow-yellow-100 ring-2 ring-yellow-400/20",
        badge: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white animate-pulse",
        text: "text-yellow-700 font-black",
        icon: "👑"
      };
      case 1: return {
        card: "border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-gray-100",
        badge: "bg-gradient-to-br from-gray-300 to-gray-500 text-white",
        text: "text-gray-700 font-bold",
        icon: "🥈"
      };
      case 2: return {
        card: "border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-orange-100",
        badge: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
        text: "text-orange-800 font-bold",
        icon: "🥉"
      };
      default: return {
        card: "border-gray-100 bg-white",
        badge: "bg-gray-100 text-gray-500",
        text: "text-gray-600 font-bold",
        icon: (index + 1).toString()
      };
    }
  };

  return (
    <div className="w-full glass-card rounded-[2.5rem] shadow-2xl p-6 md:p-8 flex flex-col space-y-6 min-h-[500px] border border-white relative overflow-hidden">
      {/* Decorative Sparkles for Header */}
      <div className="absolute top-4 right-10 text-yellow-400 animate-bounce delay-75">✨</div>
      <div className="absolute top-10 left-10 text-yellow-500 animate-pulse">⭐</div>
      
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-black text-rajhi-blue flex items-center space-x-2 space-x-reverse">
          <span className="text-rajhi-gold">🏆</span>
          <span>لوحة الأبطال</span>
        </h2>
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          title="العودة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-rajhi-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">جاري جلب قائمة الأبطال...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-3xl">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg">إعادة المحاولة</button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="text-6xl mb-4">🏜️</div>
          <p className="text-gray-400 text-lg font-bold">لا يوجد متسابقون بعد. كن الأول!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar scroll-smooth">
          {data.map((entry, index) => {
            const style = getRankStyle(index);
            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] duration-300 relative overflow-hidden group ${style.card}`}
              >
                {/* Winner Shimmer Effect for #1 */}
                {index === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
                )}
                
                <div className="flex items-center space-x-4 space-x-reverse relative z-10">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-lg transform group-hover:rotate-12 transition-transform ${style.badge}`}>
                    {style.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`${style.text} ${index === 0 ? 'text-lg' : 'text-base'}`}>
                      {entry["المتسابق"]}
                    </span>
                    {index === 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-yellow-600 font-black uppercase tracking-widest bg-yellow-100 px-2 rounded-full">بطل الأثر</span>
                        <span className="text-xs">✨</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-4 space-x-reverse items-center relative z-10">
                  <div className="flex flex-col items-end border-l pl-4 border-gray-100">
                    <span className={`font-black text-xl leading-none ${index === 0 ? 'text-rajhi-blue' : 'text-gray-800'}`}>
                      {entry["النقاط"]}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">نقطة</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-600 font-bold text-sm leading-none">{entry["الوقت"] || '--'}ث</span>
                    <span className="text-[10px] text-gray-400 font-bold">الوقت</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full py-5 bg-gradient-to-r from-rajhi-blue to-rajhi-blue/80 text-white font-black rounded-2xl shadow-xl shadow-rajhi-blue/20 transform active:scale-95 transition-all text-lg mt-2"
      >
        العودة للرئيسية
      </button>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5a059;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Leaderboard;
