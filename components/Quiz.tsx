
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question } from '../types';

interface QuizProps {
  questions: Question[];
  onFinish: (score: number, choices: Record<string, string>, totalSeconds: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalSecondsSpent, setTotalSecondsSpent] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQuestion = questions[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      onFinish(score, choices, totalSecondsSpent);
    }
  }, [currentIndex, questions.length, score, choices, onFinish, totalSecondsSpent]);

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        setTotalSecondsSpent(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
      setChoices(prev => ({
        ...prev,
        [currentQuestion.text]: "انتهى الوقت"
      }));
      setTimeout(handleNext, 1200);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isAnswered, handleNext, currentQuestion.text]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    const selectedText = currentQuestion.options[index];
    setSelectedOption(index);
    setIsAnswered(true);
    
    setChoices(prev => ({
      ...prev,
      [currentQuestion.text]: selectedText
    }));

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(handleNext, 1200);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  
  const viewBoxSize = 100;
  const strokeWidth = 8;
  const center = viewBoxSize / 2;
  const radius = (viewBoxSize - strokeWidth) / 2 - 4;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="w-full flex flex-col space-y-5 page-transition px-2">
      {/* شريط التقدم العلوي */}
      <div className="px-1">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner border border-white/20">
          <div 
            className="h-full bg-gradient-to-l from-rajhi-gold via-rajhi-gold to-yellow-200 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full bg-white rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden pb-8">
        <div className="pt-8 flex flex-col items-center justify-center space-y-5">
          <span className="bg-rajhi-blue/10 text-rajhi-blue px-6 py-2 rounded-full text-xs font-black border-2 border-rajhi-blue/20 shadow-sm">
            سؤال {currentIndex + 1} من {questions.length}
          </span>

          <div className="relative flex items-center justify-center w-24 h-24">
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
              className="transform -rotate-90 drop-shadow-md overflow-visible"
            >
              <circle cx={center} cy={center} r={radius} stroke="#f3f4f6" strokeWidth={strokeWidth} fill="transparent" />
              <circle
                cx={center} cy={center} r={radius} stroke={timeLeft < 10 ? '#ef4444' : '#c5a059'}
                strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeLinecap="round"
                style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-black ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-rajhi-blue'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* إطار السؤال المحدد - تم تعزيز الإطار هنا ليكون بارزاً أكثر */}
        <div className="px-6 py-4">
          <div className="bg-[#fcfaf6] rounded-[2rem] border-[4px] border-rajhi-gold/30 p-7 md:p-9 text-center shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rajhi-gold/5 rounded-full -mr-8 -mt-8"></div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#001a35] leading-relaxed relative z-10">
              {currentQuestion.text}
            </h2>
          </div>
        </div>

        {/* قائمة الاختيارات بحدود واضحة جداً */}
        <div className="px-6 grid gap-4">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = index === selectedOption;
            
            let cardClass = "w-full text-right p-5 rounded-2xl border-[3px] transition-all duration-300 flex items-center justify-between active:scale-[0.98] shadow-sm ";
            let textClass = "text-base font-bold leading-tight ";
            
            if (!isAnswered) {
              cardClass += "border-gray-200 bg-white hover:border-rajhi-gold hover:bg-rajhi-gold/5 shadow-gray-200/50";
              textClass += "text-gray-900"; 
            } else {
              if (isCorrect) {
                cardClass += "border-green-500 bg-green-50 scale-[1.02] shadow-lg z-10";
                textClass += "text-green-900";
              } else if (isSelected && !isCorrect) {
                cardClass += "border-red-500 bg-red-50 shadow-lg z-10";
                textClass += "text-red-900";
              } else {
                cardClass += "border-gray-100 bg-gray-50 opacity-40";
                textClass += "text-gray-400";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={cardClass}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-sm font-black shadow-md ${
                    isAnswered 
                    ? (isCorrect ? 'bg-green-600 text-white' : isSelected ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500')
                    : 'bg-rajhi-blue text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={textClass}>{option}</span>
                </div>

                {isAnswered && (isCorrect || (isSelected && !isCorrect)) && (
                  <div className={`${isCorrect ? 'bg-green-600' : 'bg-red-600'} rounded-full p-1.5 ml-2 shadow-sm`}>
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d={isCorrect ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* شريط الإحصائيات السفلي */}
      <div className="flex justify-between items-center px-6 py-4 bg-white rounded-3xl border-2 border-gray-100 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">النقاط الحالية</span>
            <span className="text-rajhi-blue font-black text-2xl leading-none">{score}</span>
          </div>
          <div className="w-[1px] h-10 bg-gray-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">الوقت الكلي</span>
            <span className="text-gray-700 font-black text-2xl leading-none">{totalSecondsSpent}ث</span>
          </div>
        </div>
        <div className="text-xs font-black text-rajhi-gold bg-rajhi-gold/10 px-4 py-2 rounded-xl border-2 border-rajhi-gold/20">
          محور الأثر
        </div>
      </div>
    </div>
  );
};

export default Quiz;
