'use client'; // This must be a client component to handle exam selection state

import { useState, useEffect } from 'react';
import { getUserProgress } from '@/app/actions/skillTreeActions';
import SkillTreeBoard from '@/components/SkillTree/SkillTreeBoard';
import { useSession } from 'next-auth/react'; // Assuming you use next-auth

export default function JourneyPage() {
  const { data: session, status } = useSession();
  const [masteredNodes, setMasteredNodes] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch progress on load
  useEffect(() => {
    if (session?.user?.id) {
      getUserProgress(session.user.id).then((data) => {
        setMasteredNodes(data);
        setLoading(false);
      });
    }
  }, [session]);

  if (status === "unauthenticated") return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
      <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-purple-900">Access Restricted</h2>
        <p className="text-slate-500 mb-6">Log in to track your progress.</p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
          Log In
        </button>
      </div>
    </div>
  );

  // --- EXAM PICKER SCREEN ---
  if (!selectedExam) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Choose Your Battle</h1>
          <p className="text-slate-500 mb-10">Select your target exam to initialize your roadmap.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['JEE', 'NEET', 'CAT', 'UPSC', 'GATE'].map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExam(exam)}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all group"
              >
                <span className="block text-2xl font-black text-slate-800 group-hover:text-purple-600">{exam}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <main className="relative p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-widest border border-purple-200">
                {selectedExam} 2026 Roadmap
              </span>
              <button onClick={() => setSelectedExam(null)} className="text-[10px] text-slate-400 underline">Change</button>
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter">
              MASTER <span className="text-purple-600 italic">PATH</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Progress</p>
              <p className="text-slate-900 text-2xl font-bold">{masteredNodes.length}</p>
            </div>
          </div>
        </header>
        
        <section className="rounded-[2.5rem] border border-slate-100 bg-white/70 backdrop-blur-md shadow-xl p-2">
           <SkillTreeBoard 
             userId={session.user.id} 
             masteredNodes={masteredNodes} 
             examType={selectedExam} 
           />
        </section>
      </div>
    </main>
  );
}