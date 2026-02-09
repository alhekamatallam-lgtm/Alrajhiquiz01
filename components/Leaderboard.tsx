
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

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-400 text-white shadow-yellow-200"; // Gold
      case 1: return "bg-gray-300 text-white shadow-gray-200"; // Silver
      case 2: return "bg-orange-400 text-white shadow-orange-200"; // Bronze
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return "👑";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col space-y-6 min-h-[500px]">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-black text-rajhi-blue flex items-center space-x-2 space-x-reverse">
          <span>ترتيب المتصدرين</span>
          <span className="text-rajhi-gold">🏆</span>
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
          <p className="text-gray-500 font-medium">جاري جلب قائمة الأبطال...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-2xl">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-rajhi-blue underline font-bold">إعادة المحاولة</button>
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <p className="text-gray-400 text-lg">لا يوجد متسابقون بعد. كن الأول!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {data.map((entry, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${index < 3 ? 'border-rajhi-gold/30 bg-rajhi-gold/5' : 'border-gray-50 bg-white'}`}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md ${getBadgeColor(index)}`}>
                  {getRankIcon(index)}
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold ${index === 0 ? 'text-rajhi-blue text-lg' : 'text-gray-700'}`}>
                    {entry["المتسابق"]}
                  </span>
                  {index === 0 && <span className="text-[10px] text-rajhi-gold font-bold">المركز الأول</span>}
                </div>
              </div>
              <div className="flex space-x-4 space-x-reverse items-center">
                <div className="flex flex-col items-end border-l pl-4 border-gray-100">
                    <span className="text-rajhi-blue font-black text-xl leading-none">{entry["النقاط"]}</span>
                    <span className="text-[10px] text-gray-400">نقطة</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-gray-700 font-bold text-sm leading-none">{entry["الوقت"] || '--'} ث</span>
                    <span className="text-[10px] text-gray-400">الوقت</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full py-4 bg-rajhi-blue text-white font-bold rounded-xl shadow-lg shadow-rajhi-blue/20 transform active:scale-95 transition-all"
      >
        العودة للرئيسية
      </button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
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
