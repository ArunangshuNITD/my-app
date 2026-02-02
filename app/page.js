"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  motion, useScroll, useTransform, useSpring, useMotionValue, 
  useMotionTemplate, AnimatePresence, useInView 
} from "framer-motion";
import { 
  FaGraduationCap, FaMedal, FaUniversity, FaCheckCircle, FaArrowRight, 
  FaQuestion, FaCog, FaLeaf, FaLandmark, FaDna, FaAtom, FaBalanceScale, 
  FaUserCircle, FaSearch, FaStar, FaQuoteLeft
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt, HiUsers, HiChatAlt2 } from "react-icons/hi";

// ==========================================
// 1. BACKGROUND & FX LAYERS
// ==========================================

const Meteors = ({ number = 20 }) => {
  const [meteorStyles, setMeteorStyles] = useState([]);
  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: Math.floor(Math.random() * 100) + "%",
      left: Math.floor(Math.random() * 100) + "%",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      <style jsx global>{`
        @keyframes meteor {
          0% { transform: rotate(15deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(15deg) translateX(-500px); opacity: 0; }
        }
        .animate-meteor-effect {
          animation: meteor 5s linear infinite;
        }
      `}</style>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className="pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor-effect rounded-[9999px] bg-indigo-500 shadow-[0_0_0_1px_#ffffff10]"
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-transparent" />
        </span>
      ))}
    </>
  );
};

function SpotlightGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      className="absolute inset-0 z-0 h-full w-full bg-zinc-50 dark:bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(79, 70, 229, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <Meteors number={25} />
    </div>
  );
}

function BackgroundIcons() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 text-zinc-200 dark:text-zinc-900 opacity-40"
      >
        <FaCog size={400} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -right-20 text-zinc-200 dark:text-zinc-900 opacity-30"
      >
        <FaLandmark size={350} />
      </motion.div>
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }}}
        className="absolute top-[30%] left-[5%] text-emerald-500/10 opacity-50 blur-[1px]"
      >
        <FaDna size={180} />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[15%] right-[10%] text-purple-500/10 opacity-50"
      >
        <FaAtom size={120} />
      </motion.div>
       <motion.div
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[15%] left-[15%] text-green-200 dark:text-green-900/40 opacity-40"
      >
        <FaLeaf size={100} />
      </motion.div>
    </div>
  );
}

// ==========================================
// 2. HERO ELEMENTS (Parallax & Orbit)
// ==========================================

function ParallaxCard({ children, className, depth = 20 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    const xPos = (e.clientX - innerWidth / 2) / depth;
    const yPos = (e.clientY - innerHeight / 2) / depth;
    x.set(xPos);
    y.set(yPos);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      style={{ x, y }}
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-xl backdrop-blur-md dark:border-zinc-700/60 dark:bg-zinc-900/60 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function OrbitingQuestion({ text, radius, duration, reverse = false, delay = 0 }) {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 hidden xl:flex">
        <motion.div
          style={{ width: radius * 2, height: radius * 2 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: reverse ? -360 : 360 }}
          transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: delay }}
          className="absolute flex items-center justify-center rounded-full border border-indigo-500/5" 
        >
          <motion.div
            style={{ position: 'absolute', top: 0, left: '50%', x: '-50%', y: '-50%' }}
            initial={{ rotate: 0 }}
            animate={{ rotate: reverse ? 360 : -360 }} 
            transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: delay }}
          >
             <div className="flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-indigo-500/30 bg-white px-5 py-3 text-sm font-bold text-zinc-700 shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] backdrop-blur-md dark:bg-zinc-900 dark:text-zinc-200 dark:border-indigo-400/30 hover:scale-110 transition-transform cursor-pointer pointer-events-auto">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-600 dark:text-white">
                    <FaQuestion size={10} />
                </span>
                {text}
             </div>
          </motion.div>
        </motion.div>
      </div>
    );
}

// ==========================================
// 3. UI COMPONENTS (Search, Stats, Ticker)
// ==========================================

const SmartSearch = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 w-full max-w-2xl"
        >
            <div className="relative group rounded-2xl p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white dark:bg-zinc-950 rounded-xl p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-3 relative z-10">
                    <div className="flex-1 flex items-center gap-3 w-full px-3">
                        <FaSearch className="text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="I want to crack NEET, JEE..." 
                            className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 font-medium"
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
                    <button className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                        Find Mentor
                    </button>
                </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-medium text-zinc-500">
                <span>Popular:</span>
                {["IIT Bombay", "AIIMS Delhi", "UPSC Strategy", "Physics Doubts"].map(tag => (
                    <span key={tag} className="cursor-pointer hover:text-indigo-500 underline decoration-dashed">
                        {tag}
                    </span>
                ))}
            </div>
        </motion.div>
    )
}

const FeatureCard = ({ title, desc, icon: Icon, color }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    return (
        <motion.div 
            style={{ x, y, rotateX, rotateY, z: 100 }}
            drag
            dragElastic={0.16}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            whileHover={{ cursor: "grab" }}
            whileTap={{ cursor: "grabbing" }}
            className="relative h-full flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden group"
        >
            <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10 transition-transform group-hover:scale-150 ${color}`}></div>
            
            <div className="relative z-10">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg ${color}`}>
                    <Icon />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </div>
            
            <div className="mt-8 flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-2 transition-transform">
                Learn more <FaArrowRight className="ml-2" />
            </div>
        </motion.div>
    );
}

const AnimatedCounter = ({ value, label }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value.replace(/,/g, '').replace(/\+/g, ''));
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-center p-6 border-r border-zinc-200 dark:border-zinc-800 last:border-0">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-2">
                {count}{value.includes('+') ? '+' : ''}{value.includes('k') ? 'k' : ''}
            </div>
            <div className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
        </div>
    )
}


// ==========================================
// 4. LIVE NOTIFICATIONS
// ==========================================

function LiveBookingNotification() {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({ name: "", action: "" });
  
  const names = ["Aarav", "Priya", "Rahul", "Sneha", "Vikram", "Ananya"];
  const actions = [
    "booked a session with AIR 5", 
    "joined the NEET squad", 
    "started a chat with IITB Alum", 
    "just cleared a mock interview"
  ];

  useEffect(() => {
    const cycle = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setInfo({ name: randomName, action: randomAction });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    const interval = setInterval(cycle, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/90 p-3 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 w-80"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <FaUserCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200"><span className="text-indigo-600">{info.name}</span> {info.action}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Just now</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// 5. MAIN COMPONENT (No Navbar/Footer)
// ==========================================

export default function Home() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const words = ["JEE", "NEET", "GATE", "UPSC", "CAT"];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 30 : 150);
      if (!isDeleting && text === fullText) setTimeout(() => setIsDeleting(true), 1500);
      else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <div className="group relative flex min-h-screen flex-col overflow-x-hidden bg-zinc-50 dark:bg-black font-sans selection:bg-indigo-500/30">
      
      {/* 1. LAYERS */}
      <SpotlightGrid />
      <BackgroundIcons />

      {/* 2. HERO SECTION */}
      {/* Added pt-28 to account for your existing navbar height */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
         
         {/* Orbiting Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
             <OrbitingQuestion text="Can't decide?" radius={350} duration={35} />
             <OrbitingQuestion text="Drop year worth it?" radius={480} duration={50} reverse={true} delay={2} />
         </div>

         {/* Floating Badge */}
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/50 px-4 py-1.5 text-sm font-semibold text-indigo-700 backdrop-blur-md dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300 shadow-sm"
         >
           <HiSparkles className="text-yellow-500" />
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
             <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
           </span>
           New: AI Mock Interviews available now
         </motion.div>

         {/* Headline */}
         <motion.h1 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-5xl text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl lg:text-8xl"
         >
           Find your mentor to <br />
           crack{" "}
           <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
               {text}
               <span className="absolute -right-2 top-0 h-full w-[4px] bg-indigo-500 animate-pulse rounded-full"></span>
           </span>
         </motion.h1>

         <motion.p 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="mt-8 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400"
         >
           Don't just study hard. Study smart with 1-on-1 guidance from rankers who have walked the path.
         </motion.p>

         {/* Search Component */}
         <SmartSearch />

         {/* Trust Logos */}
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="mt-16 flex flex-col items-center gap-4"
         >
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mentors from</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
              {["IIT Bombay", "AIIMS Delhi", "IIM Ahmedabad", "IISc Bangalore"].map((college) => (
                 <span key={college} className="text-xl font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                     <FaUniversity className="text-indigo-500" /> {college}
                 </span>
              ))}
            </div>
         </motion.div>
      </div>

      {/* 3. PARALLAX DECORATION (Hidden on mobile) */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto hidden lg:block">
         <ParallaxCard depth={-25} className="top-[25%] left-[5%]">
            <div className="rounded-full bg-orange-100 p-3 text-orange-600"><FaMedal size={24} /></div>
            <div><p className="text-sm font-bold dark:text-white">AIR 1</p><p className="text-xs text-zinc-500">JEE Adv</p></div>
         </ParallaxCard>
         <ParallaxCard depth={30} className="bottom-[30%] right-[8%]">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600"><FaGraduationCap size={24} /></div>
            <div><p className="text-sm font-bold dark:text-white">Alumni</p><p className="text-xs text-zinc-500">IIT Delhi</p></div>
         </ParallaxCard>
      </div>

      {/* 4. STATS BAR */}
      <div className="w-full border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4">
                <AnimatedCounter value="500+" label="Mentors" />
                <AnimatedCounter value="12000+" label="Students Guided" />
                <AnimatedCounter value="45000+" label="Minutes Taught" />
                <AnimatedCounter value="98%" label="Success Rate" />
            </div>
      </div>

     

      {/* 6. FEATURES GRID */}
      <section className="relative z-10 py-24 px-6 bg-zinc-50/50 dark:bg-black/50">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">Why Top Rankers Choose Us</h2>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">We don't just teach subjects. We teach you how to win.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "1-on-1 Strategy", desc: "Get a personalized roadmap from someone who ranked in the top 100.", icon: HiLightningBolt, color: "bg-amber-500" },
                        { title: "Mock Interviews", desc: "Practice with alumni from your dream college. Remove the fear factor.", icon: HiChatAlt2, color: "bg-purple-500" },
                        { title: "Community Access", desc: "Join a private squad of serious aspirants. No noise, just prep.", icon: HiUsers, color: "bg-emerald-500" },
                    ].map((f, i) => <FeatureCard key={i} {...f} />)}
                </div>
            </div>
      </section>

      {/* 7. TOAST NOTIFICATION */}
      <LiveBookingNotification />

    </div>
  );
}