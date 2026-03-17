'use client';

export default function ProgressRing({ stats }) {
  const { easy, medium, hard } = stats;

  const totalSolved = easy.correct + medium.correct + hard.correct;
  const totalAttempted = easy.attempted + medium.attempted + hard.attempted;
  
  // We avoid division by zero
  const accuracy = totalAttempted > 0 ? ((totalSolved / totalAttempted) * 100).toFixed(2) : "0.00";

  // SVG Math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke lengths based on contribution to total attempts (or set fixed max values)
  // Here we map the progress against the total attempted to fill the ring
  const easyPercent = totalAttempted > 0 ? easy.correct / totalAttempted : 0;
  const medPercent = totalAttempted > 0 ? medium.correct / totalAttempted : 0;
  const hardPercent = totalAttempted > 0 ? hard.correct / totalAttempted : 0;

  const easyStroke = easyPercent * circumference;
  const medStroke = medPercent * circumference;
  const hardStroke = hardPercent * circumference;

  const easyOffset = circumference;
  const medOffset = circumference - easyStroke;
  const hardOffset = circumference - easyStroke - medStroke;

  return (
    <div className="flex items-center gap-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm w-max">
      {/* Circular Chart */}
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 140 140">
          {/* Background Track */}
          <circle
            cx="70" cy="70" r={radius}
            stroke="#f1f5f9" strokeWidth="8" fill="transparent"
          />
          {/* Easy Arc (Teal) */}
          <circle
            cx="70" cy="70" r={radius}
            stroke="#14b8a6" strokeWidth="8" fill="transparent"
            strokeDasharray={`${easyStroke} ${circumference}`}
            strokeDashoffset={easyOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Medium Arc (Yellow) */}
          <circle
            cx="70" cy="70" r={radius}
            stroke="#eab308" strokeWidth="8" fill="transparent"
            strokeDasharray={`${medStroke} ${circumference}`}
            strokeDashoffset={medOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Hard Arc (Red) */}
          <circle
            cx="70" cy="70" r={radius}
            stroke="#ef4444" strokeWidth="8" fill="transparent"
            strokeDasharray={`${hardStroke} ${circumference}`}
            strokeDashoffset={hardOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5 text-slate-800">
            <span className="text-3xl font-bold">{accuracy.split('.')[0]}</span>
            <span className="text-sm font-semibold text-slate-500">.{accuracy.split('.')[1]}%</span>
          </div>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Accuracy</span>
          <span className="text-[10px] text-slate-400 mt-2">{totalAttempted} Attempts</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col gap-2">
        <div className="bg-slate-50 rounded-xl px-4 py-2 w-32 flex flex-col items-center border border-slate-100">
          <span className="text-teal-500 text-xs font-bold mb-1">Easy</span>
          <span className="text-slate-800 font-semibold">{easy.correct} <span className="text-slate-400 text-sm font-medium">/ {easy.attempted || 1}</span></span>
        </div>
        <div className="bg-slate-50 rounded-xl px-4 py-2 w-32 flex flex-col items-center border border-slate-100">
          <span className="text-yellow-500 text-xs font-bold mb-1">Med.</span>
          <span className="text-slate-800 font-semibold">{medium.correct} <span className="text-slate-400 text-sm font-medium">/ {medium.attempted || 1}</span></span>
        </div>
        <div className="bg-slate-50 rounded-xl px-4 py-2 w-32 flex flex-col items-center border border-slate-100">
          <span className="text-red-500 text-xs font-bold mb-1">Hard</span>
          <span className="text-slate-800 font-semibold">{hard.correct} <span className="text-slate-400 text-sm font-medium">/ {hard.attempted || 1}</span></span>
        </div>
      </div>
    </div>
  );
}