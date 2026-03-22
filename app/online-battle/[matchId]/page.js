"use client";
import { useEffect, useState, use } from "react"; 
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import PvPTimer from "@/components/PvPTimer";
import { submitMatchResults, cancelMatch, savePlayerAnswer } from "@/app/actions/pvpActions"; 
import { Loader2, Swords, X, Clock } from "lucide-react";

export default function LivePvPBoard({ params }) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.matchId;

  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId"); 
  const userName = searchParams.get("userName") || "You"; 

  const [matchData, setMatchData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  
  const [gameStatus, setGameStatus] = useState("loading"); 
  const [opponentName, setOpponentName] = useState("Opponent");
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch(`/api/matches/${matchId}`); 
        const data = await res.json();
        
        if (data.success && data.match) {
          setMatchData(data.match); 
          if (data.match.status === "playing") setGameStatus("playing");
          else if (data.match.player2 && data.match.player2.userId) {
            const oppName = data.match.player1.userId === userId ? data.match.player2.name : data.match.player1.name;
            setOpponentName(oppName || "Opponent");
            setGameStatus("opponent_found");
          } else setGameStatus("waiting");
        } else router.push('/online-battle');
      } catch (err) { console.error(err); }
    };
    fetchMatch();
  }, [matchId, userId, router]);

  // FIX: Minimal dependency array prevents WebSocket from randomly disconnecting!
  useEffect(() => {
    const channel = supabase.channel(`match_${matchId}`);

    channel
      .on('broadcast', { event: 'score_update' }, (payload) => {
        if (payload.userId !== userId) setOpponentScore(payload.score);
      })
      .on('broadcast', { event: 'player_joined' }, (payload) => {
        if (payload.userId !== userId) {
          setOpponentName(payload.userName);
          setGameStatus("opponent_found"); 
        }
      })
      .on('broadcast', { event: 'player_ready' }, (payload) => {
        if (payload.userId !== userId) setOpponentReady(true);
      })
      .on('broadcast', { event: 'player_canceled' }, (payload) => {
        if (payload.userId !== userId) {
          alert("Your opponent canceled the match.");
          router.push('/online-battle');
        }
      })
      .subscribe();

    channel.send({ type: 'broadcast', event: 'player_joined', payload: { userId, userName } });

    return () => { supabase.removeChannel(channel); };
  }, [matchId, userId, userName]); // <-- Empty of gameStatus to keep connection solid

  useEffect(() => {
    if (gameStatus !== "waiting") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleTimeout = async () => {
    await cancelMatch(matchId); 
    alert("Opponent not found. Please try again later!");
    router.push('/online-battle');
  };

  useEffect(() => {
    if (isReady && opponentReady) {
      setGameStatus("playing");
      setQuestionStartTime(Date.now()); // Start timer for question 1
    }
  }, [isReady, opponentReady]);

  const handleReady = () => {
    setIsReady(true);
    supabase.channel(`match_${matchId}`).send({ type: 'broadcast', event: 'player_ready', payload: { userId } });
  };

  const handleCancel = async () => {
    supabase.channel(`match_${matchId}`).send({ type: 'broadcast', event: 'player_canceled', payload: { userId } });
    await cancelMatch(matchId); 
    router.push('/online-battle');
  };

  const handleEndGame = async (finalScore) => {
    setGameStatus("ended");
    setIsSubmitting(true);
    await submitMatchResults(matchId, userId, finalScore);
    setIsSubmitting(false);
  };

  const moveToNextQuestion = (currentScore) => {
    if (currentQIndex < matchData.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setQuestionStartTime(Date.now()); // Reset timer
    } else {
      handleEndGame(currentScore);
    }
  };

  const handleTimeUp = () => {
    savePlayerAnswer(matchId, userId, { questionIndex: currentQIndex, selectedOption: null, timeTaken: 30 });
    moveToNextQuestion(myScore);
  };

  const handleAnswer = (optionId) => {
    // 1. Immediately fire-and-forget save to database!
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    savePlayerAnswer(matchId, userId, {
      questionIndex: currentQIndex,
      selectedOption: optionId,
      timeTaken: Math.min(timeTaken, 30)
    });

    // 2. Original live score logic
    const isCorrect = matchData.questions[currentQIndex].correctAnswer === optionId;
    let newScore = myScore;
    
    if (isCorrect) {
      newScore = myScore + 10;
      setMyScore(newScore);
      
      supabase.channel(`match_${matchId}`).send({
        type: 'broadcast',
        event: 'score_update',
        payload: { userId, score: newScore }
      });
    }

    moveToNextQuestion(newScore);
  };

  // --- RENDERING VIEWS --- 
  if (gameStatus === "loading" || !matchData) {
    return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  }

  if (gameStatus === "waiting") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="relative w-24 h-24 mb-6">
           <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-200">Searching for Opponent...</h2>
        <p className="text-slate-500 mt-2">Preparing the {matchData.category} arena.</p>
        
        <div className="flex items-center gap-2 mt-6 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-slate-300">
          <Clock size={16} className="text-blue-400" />
          <span>Timeout in: <span className="font-mono font-bold">{timeLeft}s</span></span>
        </div>

        <button onClick={handleCancel} className="mt-8 text-slate-400 hover:text-white transition">Cancel Matchmaking</button>
      </div>
    );
  }

  if (gameStatus === "opponent_found") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl text-center max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Swords size={40} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Match Found!</h2>
          
          <div className="text-lg font-bold mb-8 flex justify-center items-center gap-3">
             <span className="text-blue-400">{userName}</span>
             <span className="text-slate-500">vs</span>
             <span className="text-red-400">{opponentName}</span>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleReady} disabled={isReady}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isReady ? "bg-green-600/20 text-green-400 border border-green-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"}`}
            >
              {isReady ? "Waiting for opponent..." : "I'm Ready"}
            </button>
            <button 
              onClick={handleCancel} disabled={isReady}
              className="w-full py-4 rounded-xl font-bold text-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 border border-slate-700 hover:border-red-500/50 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <X size={20} /> Leave Arena
            </button>
          </div>
          {opponentReady && <p className="mt-6 text-green-400 font-medium animate-pulse">{opponentName} is Ready!</p>}
        </div>
      </div>
    );
  }

  if (gameStatus === "ended") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        {isSubmitting ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            <p className="text-xl">Syncing battle results with the server...</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl text-center max-w-lg w-full">
            <h1 className="text-4xl font-black mb-8 text-white">Battle Concluded!</h1>
            
            <div className="flex justify-around items-center mb-8">
               <div className="text-center">
                 <p className="text-slate-400 text-sm mb-1">{userName}</p>
                 <p className="text-4xl font-bold text-blue-400">{myScore}</p>
               </div>
               <div className="h-16 w-px bg-slate-700"></div>
               <div className="text-center">
                 <p className="text-slate-400 text-sm mb-1">{opponentName}</p>
                 <p className="text-4xl font-bold text-red-400">{opponentScore}</p>
               </div>
            </div>

            <div className={`py-4 rounded-xl mb-8 ${myScore > opponentScore ? 'bg-green-500/10 text-green-400 border border-green-500/20' : myScore < opponentScore ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
               <h2 className="text-3xl font-bold tracking-widest uppercase">
                 {myScore > opponentScore ? "Victory" : myScore < opponentScore ? "Defeat" : "Draw"}
               </h2>
            </div>
            
            <button onClick={() => router.push('/online-battle')} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition border border-slate-600">
              Return to Lobby
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQ = matchData.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-10 text-white">
      <div className="max-w-4xl mx-auto flex justify-between items-center bg-slate-900/50 backdrop-blur p-4 rounded-2xl border border-slate-700/50 mb-8 sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/50">
             <span className="font-bold text-blue-400">P1</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{userName}</p>
            <p className="text-2xl font-black text-blue-400 leading-none">{myScore}</p>
          </div>
        </div>
        
        <div className="text-2xl font-black text-slate-600 italic">VS</div>
        
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{opponentName}</p>
            <p className="text-2xl font-black text-red-400 leading-none">{opponentScore}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/50">
             <span className="font-bold text-red-400">P2</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
           <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentQIndex) / matchData.questions.length) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-start mb-8 mt-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-slate-800 border border-slate-700 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
               {currentQ.subject}
            </div>
            <p className="text-slate-500 font-medium">Question {currentQIndex + 1} of {matchData.questions.length}</p>
          </div>
          
          <PvPTimer key={currentQIndex} duration={30} questionIndex={currentQIndex} onTimeUp={handleTimeUp} />
        </div>
        
        <h2 className="text-2xl font-semibold mb-10 leading-relaxed text-slate-100">{currentQ.text}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt) => (
            <button
              key={opt.id} onClick={() => handleAnswer(opt.id)}
              className="group relative bg-slate-950 border-2 border-slate-800 hover:border-blue-500 hover:bg-slate-900 p-6 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-500/20 group-hover:text-blue-400 flex items-center justify-center font-bold text-slate-500 transition-colors">
                  {opt.id}
                </span> 
                <span className="text-lg text-slate-300 group-hover:text-white pt-1">{opt.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}