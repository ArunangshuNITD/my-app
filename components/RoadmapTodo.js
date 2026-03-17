'use client';

import { useState, useEffect } from 'react';
import { generateStudyRoadmap, toggleRoadmapTask, deleteRoadmap } from '@/app/actions/roadmapActions';
import { Loader2, Trash2, CheckCircle2, Circle, Sparkles, CalendarDays } from 'lucide-react';

export default function RoadmapTodo({ initialRoadmap, userId, examType }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [loading, setLoading] = useState(false);

  // CRITICAL: Update local state if the database payload changes/loads in the parent
  useEffect(() => {
    setRoadmap(initialRoadmap);
  }, [initialRoadmap]);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateStudyRoadmap(userId, examType);
    if (res.success) {
      setRoadmap(res.roadmap);
    } else {
      console.error(res.message);
    }
    setLoading(false);
  };

  const handleToggle = async (dayIndex, taskId, currentStatus) => {
    if (!roadmap) return;
    
    // 1. Optimistic UI update (feels instant to the user)
    const updatedRoadmap = { ...roadmap };
    const task = updatedRoadmap.days[dayIndex].tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !currentStatus;
      setRoadmap(updatedRoadmap);
    }

    // 2. Background database update
    await toggleRoadmapTask(userId, dayIndex, taskId, !currentStatus);
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteRoadmap(userId);
    setRoadmap(null);
    setLoading(false);
  };

  // State 1: No Roadmap exists yet
  if (!roadmap || !roadmap.days || roadmap.days.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 p-10 shadow-sm text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-5">
          <Sparkles className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">Need a structured plan?</h3>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
          Let our AI analyze your performance, accuracy, and attempts to generate a highly personalized 7-day action plan targeting your weak points.
        </p>
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 mx-auto disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-slate-900/10"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Metrics...</>
          ) : (
            <><Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" /> Generate 7-Day AI Roadmap</>
          )}
        </button>
      </div>
    );
  }

  // State 2: Roadmap exists and is loaded from DB
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-[#fafafa]">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-500" />
            Your 7-Day Mastery Plan
          </h3>
          <p className="text-sm text-slate-500 mt-1">Generated specifically for your {examType} goals.</p>
        </div>
        <button 
          onClick={handleDelete}
          disabled={loading}
          className="text-slate-400 hover:text-red-500 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 text-sm font-medium"
          title="Remove Plan"
        >
          <Trash2 className="w-4 h-4" /> Reset Plan
        </button>
      </div>

      {/* Grid of Days */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-white">
        {roadmap.days.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-[#fafafa] rounded-2xl p-5 border border-slate-200/60 hover:border-indigo-200 transition-colors">
            <div className="mb-5 pb-4 border-b border-slate-200/60">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md mb-3 inline-block tracking-wide uppercase">
                Day {day.day}
              </span>
              <h4 className="font-bold text-slate-800 leading-snug">{day.title}</h4>
            </div>
            
            <div className="space-y-4">
              {day.tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => handleToggle(dayIndex, task.id, task.completed)}
                >
                  <button className="mt-0.5 shrink-0 text-slate-300 group-hover:text-indigo-400 transition-colors">
                    {task.completed ? 
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : 
                      <Circle className="w-5 h-5" />
                    }
                  </button>
                  <p className={`text-sm leading-relaxed transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                    {task.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}