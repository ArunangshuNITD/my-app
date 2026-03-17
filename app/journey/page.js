'use client'; 

import { useState, useEffect } from 'react';
import { getUserProgress } from '@/app/actions/skillTreeActions';
import SkillTreeBoard from '@/components/SkillTree/SkillTreeBoard';
import ProgressRing from '@/components/ProgressRing';
import { useSession } from 'next-auth/react'; 
import { ArrowRight } from 'lucide-react';

export default function JourneyPage() {
  const { data: session, status } = useSession();
  const [progressData, setProgressData] = useState(null); 
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch progress on load
  useEffect(() => {
    if (session?.user?.id) {
      getUserProgress(session.user.id).then((data) => {
        setProgressData(data || { masteredNodes: [], subjectAnalytics: {} });
        setLoading(false);
      });
    }
  }, [session]);

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

  // --- MAIN DASHBOARD ---
  return (
    <main className="relative p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      {/* Subtle, professional background glows */}
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
        
        {/* SKILL TREE SECTION (Moved above analytics) */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm h-[60vh] min-h-[500px] overflow-hidden relative">
           <SkillTreeBoard 
             userId={session?.user?.id} 
             masteredNodes={masteredNodes} 
             examType={selectedExam} 
           />
        </section>

        {/* ANALYTICS DASHBOARD (Bottom Panel) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Nodes Mastered Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            {/* Decorative background circle */}
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
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Accuracy Analytics</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                A granular breakdown of your performance metrics across different difficulty tiers. Focus on your weak points to improve overall competency.
              </p>
            </div>
            
            {/* The imported component fits naturally here */}
            <div className="shrink-0 scale-95 md:scale-100 origin-right">
              <ProgressRing stats={ringStats} />
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}