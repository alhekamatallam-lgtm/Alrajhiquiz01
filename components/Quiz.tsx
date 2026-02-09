
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
  
  // Bulleproof Timer SVG settings to avoid clipping
  const viewBoxSize = 100;
  const strokeWidth = 8;
  const center = viewBoxSize / 2;
  const radius = (viewBoxSize - strokeWidth) / 2 - 4; // 4px extra safety margin
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="w-full flex flex-col space-y-5 page-transition px-2">
      {/* Dynamic Progress Bar */}
      <div className="px-1">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-l from-rajhi-gold to-rajhi-gold/40 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full glass-card rounded-[2.5rem] shadow-2xl border border-white overflow-hidden pb-8">
        {/* Centered Header Section */}
        <div className="pt-8 flex flex-col items-center justify-center space-y-5">
          <span className="bg-rajhi-blue/10 text-rajhi-blue px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-rajhi-blue/5">
            سؤال {currentIndex + 1} من {questions.length}
          </span>

          {/* Centered Circular Timer with No Clipping */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
              className="transform -rotate-90 drop-shadow-md overflow-visible"
            >
              {/* Background Circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-gray-100"
              />
              {/* Progress Circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeLinecap="round"
                style={{ 
                  strokeDashoffset: offset, 
                  transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' 
                }}
                className={timeLeft < 10 ? 'text-red-500' : 'text-rajhi-gold'}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
              <span className={`text-2xl font-black leading-none ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-rajhi-blue'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {/* Question Text Centered */}
        <div className="px-6 py-6 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-rajhi-blue leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options Grid Optimized for Mobile Touch */}
        <div className="px-5 grid gap-3">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = index === selectedOption;
            
            let cardClass = "w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between active:scale-[0.98] ";
            
            if (!isAnswered) {
              cardClass += "border-gray-50 bg-gray-50/50 hover:bg-white hover:border-rajhi-gold/30";
            } else {
              if (isCorrect) {
                cardClass += "border-green-500 bg-green-50 text-green-700 font-bold scale-[1.02] shadow-xl shadow-green-100/50";
              } else if (isSelected && !isCorrect) {
                cardClass += "border-red-500 bg-red-50 text-red-700 shadow-xl shadow-red-100/50";
              } else {
                cardClass += "border-transparent bg-gray-50 opacity-40 grayscale-[0.5]";
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
                  <div className={`w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                    isAnswered 
                    ? (isCorrect ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400')
                    : 'bg-rajhi-blue text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-base font-bold leading-tight">{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <div className="bg-green-500 rounded-full p-1 ml-2 shadow-lg shadow-green-200">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <div className="bg-red-500 rounded-full p-1 ml-2 shadow-lg shadow-red-200">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Status Info Bar */}
      <div className="flex justify-between items-center px-6 py-4 glass-card rounded-3xl border border-white/50 shadow-xl shadow-rajhi-blue/5">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">النقاط</span>
            <span className="text-rajhi-blue font-black text-xl leading-none">{score}</span>
          </div>
          <div className="w-[1px] h-8 bg-gray-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">الوقت</span>
            <span className="text-gray-700 font-black text-xl leading-none">{totalSecondsSpent}ث</span>
          </div>
        </div>
        <div className="text-[11px] font-black text-rajhi-gold bg-rajhi-gold/10 px-4 py-2 rounded-xl border border-rajhi-gold/20">
          محور الأثر
        </div>
      </div>
    </div>
  );
};

export default Quiz;
