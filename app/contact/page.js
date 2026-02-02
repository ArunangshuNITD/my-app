"use client";

import { handleContactForm } from "../actions/contact";
import { 
  FaEnvelope, FaMapMarkerAlt, FaPhone, FaArrowRight, 
  FaBolt, FaUsers, FaShieldAlt, FaQuestionCircle 
} from "react-icons/fa"; // Changed FaLightningBolt to FaBolt
import { useSearchParams } from "next/navigation";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success");

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 px-6 py-24 lg:px-8">
      
      {/* --- BACKGROUND ORBS --- */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-[-5%] left-[-5%] h-[600px] w-[600px] animate-pulse rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] h-[500px] w-[500px] animate-bounce [animation-duration:12s] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        
        {/* --- SECTION 1: HERO & CORE CONTACT --- */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 mb-32">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>Direct Support Channel</span>
            </div>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl leading-[1.1]">
              Help is just a <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">ping</span> away.
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Whether you're stuck on a technical challenge or need career navigation, our mentorship network is primed to assist. 
            </p>

            <div className="mt-10 space-y-6">
              {[
                { icon: FaPhone, label: "Hotline", value: "+91 98765 43210" },
                { icon: FaEnvelope, label: "Support", value: "hello@mentorconnect.com" },
                { icon: FaMapMarkerAlt, label: "HQ", value: "IIT Bombay, Mumbai, India" },
              ].map((item, i) => (
                <div key={i} className="group flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 group-hover:ring-indigo-500 transition-all dark:bg-zinc-900 dark:ring-zinc-800">
                    <item.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{item.label}</p>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 to-fuchsia-500 opacity-20 blur-2xl"></div>
            <div className="relative rounded-[2rem] border border-white/20 bg-white/80 backdrop-blur-xl p-8 shadow-2xl dark:bg-zinc-900/80 sm:p-12">
              
              {isSuccess ? (
                <div className="flex h-[450px] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">Message Transmitted</h3>
                  <p className="mt-3 text-zinc-500 max-w-xs">We've received your data and assigned it to a coordinator.</p>
                  <a href="/contact" className="mt-8 inline-flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-500 transition-all">
                    New Message <FaArrowRight className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <form action={handleContactForm} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                      <input required name="name" placeholder="John Doe" className="w-full rounded-2xl border-none bg-zinc-100 px-5 py-4 ring-1 ring-zinc-200 focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:ring-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email</label>
                      <input required name="email" type="email" placeholder="john@example.com" className="w-full rounded-2xl border-none bg-zinc-100 px-5 py-4 ring-1 ring-zinc-200 focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:ring-zinc-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Your Message</label>
                    <textarea required name="message" rows={5} placeholder="How can our mentors help you today?" className="w-full rounded-2xl border-none bg-zinc-100 px-5 py-4 ring-1 ring-zinc-200 focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-800 dark:ring-zinc-700" />
                  </div>
                  <button type="submit" className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 px-8 py-5 text-lg font-bold text-white transition-all hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99]">
                    <span className="relative z-10 flex items-center gap-2">
                      Send Signal <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* --- SECTION 2: THE RESPONSE JOURNEY --- */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">What happens next?</h2>
            <p className="mt-4 text-zinc-500">We take every inquiry seriously. Here is our process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaBolt, title: "Initial Review", desc: "Our AI triages your message to find the best-suited department in under 2 hours." },
              { icon: FaUsers, title: "Mentor Matching", desc: "A human coordinator matches your query with a mentor from our 500+ expert pool." },
              { icon: FaShieldAlt, title: "Secure Connect", desc: "You receive a secure link to start your conversation or book a 1-on-1 session." },
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white border border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <step.icon />
                </div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{step.title}</h4>
                <p className="mt-2 text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 3: FAQ & QUICK HELP --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <FaQuestionCircle className="text-indigo-600" /> Frequently Asked
            </h2>
            <p className="mt-4 text-zinc-500">Find instant answers to common questions about our platform.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How long does it take to get a mentor?", a: "Typically, matches are made within 24-48 hours depending on your niche." },
              { q: "Is there a cost for the initial consultation?", a: "The first 15-minute discovery call is free for all new students." },
              { q: "Can I change my mentor later?", a: "Absolutely. We prioritize the right chemistry for growth." }
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-zinc-900 dark:text-white list-none">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-180">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}