'use client'; 

import { useState, useEffect } from 'react';
import { getUserProgress } from '@/app/actions/skillTreeActions';
import SkillTreeBoard from '@/components/SkillTree/SkillTreeBoard';
import ProgressRing from '@/components/ProgressRing';
import { useSession } from 'next-auth/react'; 
import { ArrowRight, Loader2, BarChart2 } from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export default function JourneyPage() {
  const { data: session, status } = useSession();
  const [progressData, setProgressData] = useState(null); 
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch progress on load
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      getUserProgress(session.user.id)
        .then((data) => {
          // Initialize with empty fallbacks mirroring your Mongoose schema
          setProgressData(data || { masteredNodes: [], subjectAnalytics: {}, quizScores: [] });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user progress:", error);
          setLoading(false);
        });
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  // --- LOADING & UNAUTHENTICATED SCREENS ---
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-3 text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 mb-8 text-sm">Please log in to track your learning trajectory and save your progress.</p>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2">
          Authenticate <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // --- EXAM PICKER SCREEN ---
  if (!selectedExam) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Select Your Discipline</h1>
          <p className="text-slate-500 mb-12 text-lg">Choose your target examination to initialize your personalized curriculum roadmap.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['JEE', 'NEET', 'CAT', 'UPSC', 'GATE'].map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col items-center justify-center gap-2"
              >
                <span className="block text-2xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{exam}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // --- ANALYTICS AGGREGATION ---
  const masteredNodes = progressData?.masteredNodes || [];
  const analyticsMap = progressData?.subjectAnalytics || {};
  
  const ringStats = {
    easy: { attempted: 0, correct: 0 },
    medium: { attempted: 0, correct: 0 },
    hard: { attempted: 0, correct: 0 }
  };

  Object.values(analyticsMap).forEach(subject => {
    ringStats.easy.attempted += subject.easy?.attempted || 0;
    ringStats.easy.correct += subject.easy?.correct || 0;
    ringStats.medium.attempted += subject.medium?.attempted || 0;
    ringStats.medium.correct += subject.medium?.correct || 0;
    ringStats.hard.attempted += subject.hard?.attempted || 0;
    ringStats.hard.correct += subject.hard?.correct || 0;
  });

  // --- DATABASE-DRIVEN CHART DATA PARSING ---
  // Using quizScores from your Mongoose Schema
  const quizScores = progressData?.quizScores || []; 
  
  const chartData = quizScores.map(quiz => ({
    // Formats slugified nodeIds (e.g. "units-and-dimensions" -> "Units And Dimensions")
    name: quiz.nodeId.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), 
    attempts: quiz.attempts || 0,
    // Assuming 'score' represents the percentage accuracy (0-100)
    accuracy: quiz.score || 0 
  }));

  // --- MAIN DASHBOARD ---
  return (
    <main className="relative p-4 md:p-8 bg-slate-50 min-h-screen font-sans overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                {selectedExam} 2026 Cohort
              </span>
              <button onClick={() => setSelectedExam(null)} className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">
                Switch Target Exam
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Curriculum Map
            </h1>
            <p className="text-slate-500 text-sm mt-2 max-w-2xl">
              Navigate your syllabus systematically. Clear nodes by passing trials to unlock advanced topics.
            </p>
          </div>
        </header>
        
        {/* SKILL TREE SECTION */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm h-[55vh] min-h-[450px] overflow-hidden relative">
           <SkillTreeBoard 
             userId={session?.user?.id} 
             masteredNodes={masteredNodes} 
             examType={selectedExam} 
           />
        </section>

        {/* ANALYTICS DASHBOARD (Bottom Panels) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Nodes Mastered Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute -right-10 -top-10 w-40 h-40 border-[20px] border-slate-800 rounded-full opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Concepts Mastered</p>
              <h3 className="text-5xl font-black">{masteredNodes.length}</h3>
            </div>
            <div className="relative z-10 mt-6">
              <p className="text-sm text-slate-400 leading-relaxed">
                Consistent progress is key. Review your mastered nodes regularly to retain high accuracy.
              </p>
            </div>
          </div>

          {/* Progress Ring Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-sm text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Overall Accuracy</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                A granular breakdown of your performance metrics across different difficulty tiers. Focus on your weak points to improve overall competency.
              </p>
            </div>
            <div className="shrink-0 scale-95 md:scale-100 origin-right">
              <ProgressRing stats={ringStats} />
            </div>
          </div>

          {/* NODE PERFORMANCE CHART */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Topic Performance Analytics</h3>
              <p className="text-sm text-slate-500">Comparison of your total attempts versus accuracy percentage for each specific topic.</p>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false} 
                      dy={10}
                    />
                    
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    
                    <Bar 
                      yAxisId="left" 
                      dataKey="attempts" 
                      name="Total Attempts" 
                      fill="#cbd5e1" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40}
                    />
                    
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="Accuracy (%)" 
                      stroke="#4f46e5" 
                      strokeWidth={3} 
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] w-full mt-4 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <BarChart2 className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No activity recorded yet</p>
                <p className="text-slate-400 text-sm mt-1">Attempt nodes on the curriculum map to generate your analytics.</p>
              </div>
            )}
          </div>

        </section>
      </div>
    </main>
  );
}