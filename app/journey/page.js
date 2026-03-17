'use client'; 

import { useState, useEffect } from 'react';
import { getUserProgress } from '@/app/actions/skillTreeActions';
import SkillTreeBoard from '@/components/SkillTree/SkillTreeBoard';
import ProgressRing from '@/components/ProgressRing';
import RoadmapTodo from '@/components/RoadmapTodo';
import NeedsReviewQueue from '@/components/NeedsReviewQueue'; // <-- Added Spaced Repetition import
import { useSession } from 'next-auth/react'; 
import { 
  ArrowRight, Loader2, BarChart2, Target, BookOpen, 
  Award, Sparkles, Compass, Flame 
} from 'lucide-react';
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
          setProgressData(data || { masteredNodes: [], subjectAnalytics: {}, quizScores: [], roadmap: null });
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse" />
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
          </div>
          <p className="text-slate-500 font-medium tracking-wide animate-pulse">Constructing your journey...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="p-10 rounded-3xl bg-white border border-slate-200/60 text-center shadow-xl shadow-slate-200/40 max-w-md w-full relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">Access Restricted</h2>
        <p className="text-slate-500 mb-8 text-base leading-relaxed">Please log in to track your learning trajectory, view analytics, and save your progress.</p>
        <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex justify-center items-center gap-2 group shadow-lg shadow-slate-900/20 hover:shadow-indigo-600/25">
          Authenticate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  // --- EXAM PICKER SCREEN ---
  if (!selectedExam) {
    const exams = [
      { name: 'JEE', icon: <Compass className="w-8 h-8" />, color: 'from-blue-500 to-indigo-600' },
      { name: 'NEET', icon: <Target className="w-8 h-8" />, color: 'from-emerald-400 to-teal-600' },
      { name: 'CAT', icon: <BarChart2 className="w-8 h-8" />, color: 'from-amber-400 to-orange-500' },
      { name: 'UPSC', icon: <BookOpen className="w-8 h-8" />, color: 'from-rose-400 to-red-600' },
      { name: 'GATE', icon: <Award className="w-8 h-8" />, color: 'from-violet-400 to-purple-600' }
    ];

    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl w-full text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Choose your path
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Select Your Discipline</h1>
          <p className="text-slate-500 mb-16 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Initialize your personalized curriculum roadmap. Your journey adapts to your performance.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {exams.map((exam) => (
              <button
                key={exam.name}
                onClick={() => setSelectedExam(exam.name)}
                className="relative p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-transparent hover:shadow-xl transition-all duration-300 group flex flex-col items-center justify-center gap-4 overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${exam.color} transition-opacity duration-300`} />
                
                <div className="text-slate-400 group-hover:text-slate-800 transition-colors duration-300 group-hover:scale-110 transform">
                  {exam.icon}
                </div>
                <span className="block text-2xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{exam.name}</span>
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

  const quizScores = progressData?.quizScores || []; 
  const chartData = quizScores.map(quiz => ({
    name: quiz.nodeId.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), 
    attempts: quiz.attempts || 0,
    accuracy: quiz.score || 0 
  }));

  // Get user's first name for greeting
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Explorer';

  // --- MAIN DASHBOARD ---
  return (
    <main className="relative p-4 md:p-8 bg-[#fafafa] min-h-screen font-sans overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 pt-4 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Target size={14} /> {selectedExam} 2026 Cohort
              </span>
              <button 
                onClick={() => setSelectedExam(null)} 
                className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-200"
              >
                Change Path
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">{firstName}</span>.
            </h1>
            <p className="text-slate-500 text-base mt-3 max-w-2xl leading-relaxed">
              Navigate your syllabus systematically. Clear nodes by passing trials to unlock advanced topics and conquer your curriculum.
            </p>
          </div>
        </header>
        
        {/* SKILL TREE SECTION */}
        <section className="rounded-3xl border border-slate-200/80 bg-white/60 backdrop-blur-xl shadow-sm h-[60vh] min-h-[500px] overflow-hidden relative group">
           <SkillTreeBoard 
             userId={session?.user?.id} 
             masteredNodes={masteredNodes} 
             examType={selectedExam} 
           />
           {/* Subtle inner shadow for depth */}
           <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.02)] pointer-events-none rounded-3xl" />
        </section>

        {/* ANALYTICS DASHBOARD (Bottom Panels) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Nodes Mastered Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-indigo-900/10 hover:shadow-indigo-900/20 transition-all duration-300">
            {/* Decor */}
            <div className="absolute -right-6 -top-6 w-48 h-48 border-[24px] border-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-indigo-200/80 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Flame size={14} className="text-orange-400" /> Concepts Mastered
                </p>
                <h3 className="text-6xl font-black tracking-tighter drop-shadow-md">{masteredNodes.length}</h3>
              </div>
            </div>
            
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Consistent progress is key. Keep clearing nodes to retain high accuracy and build momentum.
              </p>
            </div>
          </div>

          {/* Progress Ring Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="space-y-4 max-w-sm text-center md:text-left relative z-10">
              <div className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-xl mb-2">
                <Target size={20} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Overall Accuracy</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                A granular breakdown of your performance metrics across different difficulty tiers. Focus on your weak points to improve overall competency.
              </p>
            </div>
            <div className="shrink-0 scale-95 md:scale-100 origin-right relative z-10">
              <ProgressRing stats={ringStats} />
            </div>
          </div>

          {/* NODE PERFORMANCE CHART */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Topic Analytics</h3>
                <p className="text-sm text-slate-500">Total attempts vs. accuracy percentage per topic.</p>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-[320px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                      axisLine={false} 
                      tickLine={false} 
                      dy={15}
                    />
                    
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false}
                      dx={-10}
                    />
                    
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      axisLine={false} 
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      dx={10}
                    />
                    
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '24px' }} iconType="circle" />
                    
                    <Bar 
                      yAxisId="left" 
                      dataKey="attempts" 
                      name="Total Attempts" 
                      fill="#e2e8f0" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    />
                    
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="accuracy" 
                      name="Accuracy (%)" 
                      stroke="#4f46e5" 
                      strokeWidth={4} 
                      dot={{ r: 5, strokeWidth: 3, fill: '#fff' }} 
                      activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] w-full mt-4 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <BarChart2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-600 font-semibold">No activity recorded yet</p>
                <p className="text-slate-400 text-sm mt-1 max-w-sm text-center">Attempt nodes on the curriculum map above to generate your performance analytics.</p>
              </div>
            )}
          </div>
        </section>

        {/* ========================================= */}
        {/* ACTION PLANS: AI ROADMAP & REPETITION     */}
        {/* ========================================= */}
        <section className="mt-4 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RoadmapTodo 
              userId={session?.user?.id}
              examType={selectedExam}
              initialRoadmap={progressData?.roadmap || null} 
            />
          </div>
          <div className="lg:col-span-1 h-full">
            <NeedsReviewQueue userId={session?.user?.id} />
          </div>
        </section>

      </div>
    </main>
  );
}