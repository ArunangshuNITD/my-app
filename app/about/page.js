import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FaRocket, 
  FaUsers, 
  FaLightbulb, 
  FaHandshake, 
  FaChartLine, 
  FaGlobeAmericas, 
  FaLinkedin, 
  FaTwitter, 
  FaQuoteLeft 
} from "react-icons/fa";
import { BsArrowRight, BsCheckCircleFill } from "react-icons/bs";

// ==========================================
// DATA CONSTANTS (Content Management)
// ==========================================

const STATS = [
  { id: 1, label: "Active Mentors", value: "500+", desc: "From IITs, AIIMS, and Top MNCS" },
  { id: 2, label: "Students Guided", value: "12,000+", desc: "Across 15+ Countries" },
  { id: 3, label: "Success Rate", value: "96%", desc: "Students achieving their target goals" },
  { id: 4, label: "Session Hours", value: "45k+", desc: "Of high-impact mentorship" },
];

const VALUES = [
  {
    icon: <FaUsers className="w-6 h-6 text-white" />,
    title: "Democratization",
    desc: "We believe quality guidance shouldn't be gated by geography or financial status. We are leveling the playing field for tier-2 and tier-3 city students.",
    color: "bg-blue-500",
  },
  {
    icon: <FaLightbulb className="w-6 h-6 text-white" />,
    title: "Clarity over Content",
    desc: "The world doesn't need more video lectures. It needs clear strategies on how to consume them. We focus on the 'How', not just the 'What'.",
    color: "bg-amber-500",
  },
  {
    icon: <FaHandshake className="w-6 h-6 text-white" />,
    title: "Empathy First",
    desc: "Our mentors are not just rankers; they are listeners. We prioritize emotional intelligence as much as academic excellence.",
    color: "bg-emerald-500",
  },
  {
    icon: <FaRocket className="w-6 h-6 text-white" />,
    title: "Outcome Oriented",
    desc: "We don't sell hope; we sell actionable plans. Every session ends with a concrete roadmap for the next 7 days.",
    color: "bg-indigo-500",
  },
  {
    icon: <FaChartLine className="w-6 h-6 text-white" />,
    title: "Data Driven",
    desc: "We track progress, analyze weak spots, and iterate strategies based on real performance data, not intuition.",
    color: "bg-rose-500",
  },
  {
    icon: <FaGlobeAmericas className="w-6 h-6 text-white" />,
    title: "Global Perspective",
    desc: "While we start with exams, our vision is holistic career growth, preparing students for a globally connected workforce.",
    color: "bg-purple-500",
  },
];

const TIMELINE = [
  { year: "2021", title: "The Inception", desc: "Started as a WhatsApp group helping 50 students during lockdown." },
  { year: "2022", title: "The Platform", desc: "Launched the MVP. Onboarded the first 100 mentors from IIT Bombay and Delhi." },
  { year: "2023", title: "Scaling Up", desc: "Hit 5,000 users. Introduced AI-matching algorithms to pair students with mentors." },
  { year: "2024", title: "Going Global", desc: "Expanded to GRE/GMAT guidance and professional career mentorship." },
];

const TEAM = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    bio: "Ex-Google, IIT Delhi Alum. Realized the mentorship gap while mentoring juniors during his college days.",
    image: "/avatars/arjun.jpg", // Replace with real paths
  },
  {
    name: "Sarah Jenkins",
    role: "Head of Community",
    bio: "Psychology Major with 10 years of EdTech experience. Ensures the mental well-being of our student community.",
    image: "/avatars/sarah.jpg",
  },
  {
    name: "Vikram Singh",
    role: "CTO",
    bio: "Built scalable systems for Uber. Now architecting the AI matching engine that powers MentorConnect.",
    image: "/avatars/vikram.jpg",
  },
  {
    name: "Dr. Anjali Rao",
    role: "Academic Advisor",
    bio: "PhD in Education. She curates the mentorship curriculum to ensure pedagogical accuracy.",
    image: "/avatars/anjali.jpg",
  },
];

const FAQ = [
  { q: "How do you vet your mentors?", a: "We have a rigorous 4-step process including credential verification, a mock session, and a psychological assessment." },
  { q: "Is this only for engineering?", a: "No. We cover Medical (NEET), Civil Services (UPSC), Study Abroad, and Software Engineering careers." },
  { q: "What if I am not satisfied?", a: "We offer a 'No-Questions-Asked' refund policy if you are unsatisfied with your first session." },
  { q: "Can I switch mentors?", a: "Absolutely. You can browse our directory and switch mentors at any time based on your evolving needs." },
];

// ==========================================
// SUB-COMPONENTS (Modular Architecture)
// ==========================================

const SectionHeader = ({ title, subtitle, align = "center" }) => (
  <div className={`mb-12 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    <h2 className="text-base font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
      {subtitle}
    </h2>
    <p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
      {title}
    </p>
  </div>
);

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ------------------------------- */}
      {/* 1. HERO SECTION                 */}
      {/* ------------------------------- */}
      <section className="relative isolate overflow-hidden pt-14">
        {/* Background Gradients */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-400">
                Our Story & Vision
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-7xl">
              We are architecting the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                future of guidance
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-zinc-600 dark:text-zinc-400">
              Information is everywhere. Insight is rare. We built MentorConnect to bridge 
              the gap between "hard work" and "smart work" by connecting aspirants with 
              those who have already walked the path.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 2. STATS SECTION (Glassmorphism)*/}
      {/* ------------------------------- */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div 
              key={stat.id} 
              className="flex flex-col items-center justify-center rounded-2xl bg-white/50 dark:bg-zinc-900/50 p-8 shadow-lg backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <dt className="text-sm font-medium leading-6 text-zinc-500 dark:text-zinc-400">{stat.label}</dt>
              <dd className="order-first text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {stat.value}
              </dd>
              <span className="text-xs text-center text-zinc-400 mt-2">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 3. THE MANIFESTO (Text Heavy)   */}
      {/* ------------------------------- */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Image Grid */}
            <div className="relative">
               {/* Decorative dots */}
              <div className="absolute -top-4 -left-4 -z-10">
                 <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="2" className="text-zinc-200 dark:text-zinc-800" fill="currentColor" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#dots)" />
                 </svg>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative">
                         {/* Replace with <Image> */}
                         <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs">Collaboration Img</div>
                    </div>
                    <div className="h-40 w-full bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl overflow-hidden relative flex items-center justify-center">
                         <FaQuoteLeft className="text-4xl text-indigo-500 opacity-50" />
                    </div>
                </div>
                <div className="space-y-4 pt-12">
                    <div className="h-40 w-full bg-zinc-800 dark:bg-zinc-700 rounded-2xl p-6 text-white flex flex-col justify-center">
                        <span className="text-3xl font-bold">1:1</span>
                        <span className="text-sm opacity-80">Personalized Attention</span>
                    </div>
                    <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden relative">
                        {/* Replace with <Image> */}
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-xs">Success Img</div>
                    </div>
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div>
              <SectionHeader 
                subtitle="The Problem" 
                title="Talent is universal. Opportunity is not." 
                align="left"
              />
              <div className="space-y-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                <p>
                  Every year, millions of students prepare for competitive exams. They have the same books, the same syllabi, and the same hours in a day. Yet, the outcome varies drastically. Why?
                </p>
                <p>
                  The difference isn't always intellect. It's <strong>Strategy</strong>.
                </p>
                <p>
                  Students from metropolitan cities often have access to seniors, alumni networks, and family members who guide them. "Don't read Chapter 4," "Focus on this topic," "Solve this paper."
                </p>
                <p>
                  MentorConnect was born to digitize this unfair advantage. We are building a world where a student in a remote village has the same strategic backing as a student in a top-tier coaching hub. We don't just teach subjects; we teach <em>how to win</em>.
                </p>
                
                <div className="pt-8">
                    <Link href="/mentors" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
                        Read our founding letter <BsArrowRight />
                    </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 4. CORE VALUES (Grid Layout)    */}
      {/* ------------------------------- */}
      <section className="bg-zinc-100 dark:bg-zinc-900/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader 
            subtitle="Our DNA" 
            title="Principles that guide our decisions" 
          />

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-3">
            {VALUES.map((value, idx) => (
              <div key={idx} className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 transition hover:shadow-md">
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                   <div className={`w-24 h-24 rounded-bl-full ${value.color}`}></div>
                </div>
                
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${value.color} shadow-lg`}>
                  {value.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold leading-7 text-zinc-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 5. TIMELINE (Evolution)         */}
      {/* ------------------------------- */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader subtitle="Milestones" title="Our Journey So Far" />

            <div className="relative mt-16">
                {/* Vertical Line */}
                <div className="absolute left-1/2 w-0.5 h-full bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2 hidden md:block"></div>

                <div className="space-y-12">
                    {TIMELINE.map((item, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                            {/* Content */}
                            <div className="w-full md:w-5/12 text-center md:text-left p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 z-10 relative">
                                <span className="text-5xl font-black text-zinc-100 dark:text-zinc-800 absolute -top-4 -right-4 z-0 pointer-events-none select-none">
                                    {item.year}
                                </span>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white relative z-10">{item.title}</h3>
                                <p className="mt-2 text-zinc-600 dark:text-zinc-400 relative z-10">{item.desc}</p>
                            </div>

                            {/* Dot */}
                            <div className="w-8 h-8 rounded-full bg-indigo-600 border-4 border-white dark:border-black shadow-lg z-20 my-4 md:my-0"></div>

                            {/* Spacer */}
                            <div className="w-full md:w-5/12"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 6. TEAM SECTION                 */}
      {/* ------------------------------- */}
      <section className="bg-white dark:bg-zinc-900 py-24 sm:py-32 border-y border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader subtitle="The People" title="Meet the Builders" />
            
            <ul role="list" className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {TEAM.map((person) => (
                <li key={person.name} className="group">
                    <div className="mx-auto h-48 w-48 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-inner relative">
                        {/* Use Next/Image in production */}
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            [Img]
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">{person.name}</h3>
                        <p className="text-sm font-semibold leading-6 text-indigo-600">{person.role}</p>
                        <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            {person.bio}
                        </p>
                        <ul className="mt-6 flex justify-center gap-x-6">
                            <li><a href="#" className="text-zinc-400 hover:text-blue-500"><FaLinkedin className="h-5 w-5" /></a></li>
                            <li><a href="#" className="text-zinc-400 hover:text-blue-400"><FaTwitter className="h-5 w-5" /></a></li>
                        </ul>
                    </div>
                </li>
            ))}
            </ul>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 7. FAQ SECTION                  */}
      {/* ------------------------------- */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl divide-y divide-zinc-900/10 dark:divide-white/10">
                <SectionHeader subtitle="Common Questions" title="What students ask us" />
                <dl className="mt-10 space-y-6 divide-y divide-zinc-900/10 dark:divide-white/10">
                    {FAQ.map((faq, index) => (
                    <div key={index} className="pt-6">
                        <dt>
                            <span className="text-base font-semibold leading-7 text-zinc-900 dark:text-white">{faq.q}</span>
                        </dt>
                        <dd className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                            {faq.a}
                        </dd>
                    </div>
                    ))}
                </dl>
            </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 8. CTA SECTION                  */}
      {/* ------------------------------- */}
      <section className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8 bg-zinc-900">
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle cx={512} cy={512} r={512} fill="url(#gradient-cta)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="gradient-cta">
              <stop stopColor="#4f46e5" />
              <stop offset={1} stopColor="#818cf8" />
            </radialGradient>
          </defs>
        </svg>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stop guessing.<br />Start progressing.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Join 12,000+ students who have found their path. 
            Your first consultation is on us.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/signup"
              className="rounded-md bg-white px-5 py-3 text-sm font-bold text-zinc-900 shadow-sm hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Get Started for Free
            </Link>
            <Link href="/mentors" className="text-sm font-semibold leading-6 text-white hover:text-indigo-200 transition-colors">
              Browse Mentors <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}