"use client";

import React, { useState } from "react";
import { 
  FaQuoteLeft, FaGraduationCap, FaArrowRight, 
  FaAward, FaCheckCircle, FaSearch, FaTrophy 
} from "react-icons/fa";

export default function SuccessStories() {
  const [filter, setFilter] = useState("All");

  const stories = [
    {
      id: 1,
      name: "Rahul Sharma",
      achievement: "AIR 45 - NEET 2024",
      college: "AIIMS New Delhi",
      category: "NEET",
      quote: "My mentor helped me fix my Physics numerical approach. I went from 120 to 175 in just 4 months.",
      longStory: "Coming from a small town, I was overwhelmed by the competition. My mentor, an AIIMS senior, gave me a weekly schedule that prioritized NCERT. We focused heavily on active recall for Biology and error analysis for mock tests.",
      tags: ["Biology Topper", "First Attempt"]
    },
    {
      id: 2,
      name: "Ananya Iyer",
      achievement: "99.98 Percentile - JEE",
      college: "IIT Bombay (CSE)",
      category: "JEE",
      quote: "The personalized mock test analysis was a game-changer for my Advanced preparation.",
      longStory: "I was stuck at the 98th percentile for months. Through Mentor Connect, I learned the 'Question Selection' strategy—knowing which problems to skip saved me 20 minutes in the actual exam.",
      tags: ["IIT Bombay", "Math Expert"]
    },
    {
      id: 3,
      name: "Siddharth Verma",
      achievement: "Cleared UPSC CSE 2023",
      college: "IAS (OT)",
      category: "UPSC",
      quote: "Ethics and Essay writing are about perspective, not just facts. My mentor refined my voice.",
      longStory: "After two failed prelims, I realized my answer writing was too robotic. My mentor, a serving officer, reviewed my mains copies and taught me how to link current affairs with static portions effectively.",
      tags: ["Rank 112", "Ethics Specialist"]
    }
  ];

  const categories = ["All", "NEET", "JEE", "UPSC", "GATE", "CAT"];

  const filteredStories = filter === "All" 
    ? stories 
    : stories.filter(s => s.category === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-zinc-900 py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-indigo-500 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500 blur-[120px]"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            <FaTrophy className="text-yellow-500" /> Wall of Fame
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Real Stories. <span className="text-indigo-500">Real Results.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            From sleepless nights to top ranks. Explore the journeys of aspirants who bridged the gap between hard work and success with expert mentorship.
          </p>
        </div>
      </section>

      {/* --- STATS RIBBON --- */}
      <div className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Total Successes", val: "5,000+" },
              { label: "Top 100 Ranks", val: "120+" },
              { label: "Active Mentors", val: "800+" },
              { label: "Avg. Score Boost", val: "35%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.val}</p>
                <p className="text-xs font-bold uppercase tracking-tighter text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        
        {/* --- FILTER BAR --- */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
                filter === cat
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- FEATURED STORY (Bento Style) --- */}
        {filter === "All" && (
          <div className="mb-16 overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-96 lg:h-full">
                <img 
                  src="https://images.unsplash.com/photo-1523240715632-d984bb4b9156?q=80&w=1000" 
                  className="h-full w-full object-cover" 
                  alt="Student success" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="rounded-md bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">Featured Story</span>
                </div>
              </div>
              <div className="p-10 lg:p-16">
                <FaQuoteLeft className="mb-6 text-4xl text-indigo-200 dark:text-zinc-800" />
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                  "I didn't just clear NEET; I mastered the mindset of a doctor."
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Mentor Connect matched me with a senior from AIIMS Delhi. In our 1-on-1 sessions, we didn't just solve doubts—we built a system for revision that kept me calm during the most stressful month of my life.
                </p>
                <div className="mt-8 flex items-center gap-4 border-t border-zinc-100 pt-8 dark:border-zinc-800">
                  <div className="h-14 w-14 rounded-full bg-indigo-100"></div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Riya Mehra</p>
                    <p className="text-sm text-indigo-600 font-medium italic">AIR 12 - NEET UG 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- GRID OF STORIES --- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <div key={story.id} className="group relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-indigo-500 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FaGraduationCap className="text-xl" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-indigo-500">
                  {story.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{story.name}</h3>
              <p className="mt-1 text-sm font-bold text-indigo-600">{story.achievement}</p>
              
              <div className="my-6 h-px bg-zinc-100 dark:bg-zinc-800"></div>
              
              <p className="mb-6 text-sm italic leading-relaxed text-zinc-600 dark:text-zinc-400">
                "{story.quote}"
              </p>
              
              <p className="line-clamp-4 text-sm leading-relaxed text-zinc-500">
                {story.longStory}
              </p>

              <div className="mt-auto pt-8">
                <div className="mb-6 flex flex-wrap gap-2">
                  {story.tags.map((tag, i) => (
                    <span key={i} className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-50 py-3 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white dark:bg-zinc-800 dark:text-white dark:hover:bg-indigo-600">
                  Read Full Journey <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- CALL TO ACTION --- */}
        <div className="mt-24 rounded-[3rem] bg-indigo-600 p-10 text-center text-white lg:p-20">
          <h2 className="text-3xl font-black sm:text-5xl">Your story starts here.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-indigo-100">
            Don't wait for success to find you. Connect with a mentor who has already walked the path you're on.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/mentors" className="rounded-2xl bg-white px-8 py-4 font-black text-indigo-600 shadow-xl transition-all hover:scale-105 active:scale-95">
              Find My Mentor
            </a>
            <a href="/become-mentor" className="rounded-2xl bg-indigo-500 px-8 py-4 font-black text-white ring-1 ring-inset ring-indigo-400 transition-all hover:bg-indigo-400">
              Join as Mentor
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}