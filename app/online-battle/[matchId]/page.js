"use client";
import { useEffect, useState, use, useRef } from "react"; 
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import PvPTimer from "@/components/PvPTimer";
import { submitMatchResults, cancelMatch, savePlayerAnswer } from "@/app/actions/pvpActions"; 
import { Loader2, Swords, X, Clock, Zap, Target, Snowflake, Flame } from "lucide-react";

export default function LivePvPBoard({ params }) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.matchId;

  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId"); 
  const userName = searchParams.get("userName") || "You"; 

  // Match State
  const [matchData, setMatchData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState("loading"); 
  const [opponentName, setOpponentName] = useState("Opponent");
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  // Scores & Combos
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myCombo, setMyCombo] = useState(0);
  const [opponentCombo, setOpponentCombo] = useState(0);

  // Power-Ups
  const [powerups, setPowerups] = useState({ fifty: true, freeze: true, double: true });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [doubleJeopardyActive, setDoubleJeopardyActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);

  // Emotes & UI Events
  const [activeEmotes, setActiveEmotes] = useState([]);
  const [battleMessage, setBattleMessage] = useState("");

  const channelRef = useRef(null);
  const EMOTES = ["🤯", "🚀", "😭", "🎯"];

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

  // WebSocket Listeners
  useEffect(() => {
    const channel = supabase.channel(`match_${matchId}`);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'score_update' }, (payload) => {
        if (payload.userId !== userId) {
          setOpponentScore(payload.score);
          setOpponentCombo(payload.combo);
        }
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
      .on('broadcast', { event: 'match_completed' }, (payload) => {
        renderFinalResults(payload.match);
      })
      .on('broadcast', { event: 'emote' }, (payload) => {
        if (payload.userId !== userId) triggerEmote(payload.emoji, 'opponent');
      })
      .on('broadcast', { event: 'powerup_used' }, (payload) => {
        if (payload.userId !== userId) {
          showBattleMessage(`${opponentName} used ${payload.type}!`);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({ type: 'broadcast', event: 'player_joined', payload: { userId, userName } });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [matchId, userId, userName, opponentName, router]); 

  // Fallback Polling
  useEffect(() => {
    let pollInterval;
    if (gameStatus === "waiting_for_opponent") {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/matches/${matchId}`);
          const data = await res.json();
          if (data.success && data.match?.status === "completed") {
            renderFinalResults(data.match);
          }
        } catch (err) { console.error("Polling error:", err); }
      }, 3000); 
    }
    return () => clearInterval(pollInterval);
  }, [gameStatus, matchId]);

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

  useEffect(() => {
    if (isReady && opponentReady) {
      setGameStatus("playing");
      setQuestionStartTime(Date.now()); 
    }
  }, [isReady, opponentReady]);

  const handleTimeout = async () => {
    await cancelMatch(matchId); 
    alert("Opponent not found. Please try again later!");
    router.push('/online-battle');
  };

  const handleReady = () => {
    setIsReady(true);
    channelRef.current?.send({ type: 'broadcast', event: 'player_ready', payload: { userId } });
  };

  const handleCancel = async () => {
    channelRef.current?.send({ type: 'broadcast', event: 'player_canceled', payload: { userId } });
    await cancelMatch(matchId); 
    router.push('/online-battle');
  };

  const renderFinalResults = (finalMatchData) => {
    const isPlayer1 = finalMatchData.player1.userId === userId;
    setMyScore(isPlayer1 ? finalMatchData.player1.score : finalMatchData.player2.score);
    setOpponentScore(isPlayer1 ? finalMatchData.player2.score : finalMatchData.player1.score);
    setGameStatus("ended");
  };

  const handleEndGame = async (finalScore) => {
    setGameStatus("waiting_for_opponent"); 
    const res = await submitMatchResults(matchId, userId, finalScore);

    if (res.success && res.isComplete) {
      channelRef.current?.send({ 
        type: 'broadcast', 
        event: 'match_completed', 
        payload: { match: res.match } 
      });
      renderFinalResults(res.match);
    }
  };

  const moveToNextQuestion = (currentScore) => {
    // Standard questions are 0-6 (7 total). Index 7 is Sudden Death.
    setHiddenOptions([]);
    setDoubleJeopardyActive(false);
    setTimerDuration(30);

    const isSuddenDeathNext = currentQIndex === 6;
    
    if (currentQIndex < 6) {
      setCurrentQIndex(currentQIndex + 1);
      setQuestionStartTime(Date.now()); 
    } else if (isSuddenDeathNext) {
      // Check if Tie-breaker is needed
      if (myScore === opponentScore) {
        showBattleMessage("SUDDEN DEATH!");
        setCurrentQIndex(7); // Go to tie-breaker
        setQuestionStartTime(Date.now());
      } else {
        handleEndGame(currentScore);
      }
    } else {
      // Finished sudden death
      handleEndGame(currentScore);
    }
  };

  const handleTimeUp = async () => {
    setMyCombo(0);
    channelRef.current?.send({ type: 'broadcast', event: 'score_update', payload: { userId, score: myScore, combo: 0 } });
    await savePlayerAnswer(matchId, userId, { questionIndex: currentQIndex, selectedOption: null, timeTaken: timerDuration, pointsEarned: 0 });
    moveToNextQuestion(myScore);
  };

  const handleAnswer = async (optionId) => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = matchData.questions[currentQIndex].correctAnswer === optionId;
    
    let newScore = myScore;
    let newCombo = myCombo;
    let pointsEarned = 0;
    
    if (isCorrect) {
      newCombo += 1;
      let multiplier = 1;
      if (newCombo === 2) multiplier = 1.2;
      if (newCombo >= 3) multiplier = 1.5;

      let basePoints = doubleJeopardyActive ? 20 : 10;
      pointsEarned = Math.floor(basePoints * multiplier);
      newScore += pointsEarned;
      
      if (newCombo > 1) showBattleMessage(`${newCombo}x COMBO!`);
    } else {
      newCombo = 0;
      if (doubleJeopardyActive) {
        pointsEarned = -10;
        newScore -= 10;
        showBattleMessage("Double Jeopardy Failed! -10pts");
      }
    }

    setMyScore(newScore);
    setMyCombo(newCombo);
    
    channelRef.current?.send({ type: 'broadcast', event: 'score_update', payload: { userId, score: newScore, combo: newCombo } });

    await savePlayerAnswer(matchId, userId, {
      questionIndex: currentQIndex,
      selectedOption: optionId,
      timeTaken: Math.min(timeTaken, timerDuration),
      pointsEarned: pointsEarned
    });

    moveToNextQuestion(newScore);
  };

  // --- POWER-UPS ---
  const useFiftyFifty = () => {
    if (!powerups.fifty) return;
    const currentQ = matchData.questions[currentQIndex];
    const incorrect = currentQ.options.filter(o => o.id !== currentQ.correctAnswer);
    const shuffled = incorrect.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffled[0].id, shuffled[1].id]);
    setPowerups(prev => ({ ...prev, fifty: false }));
    channelRef.current?.send({ type: 'broadcast', event: 'powerup_used', payload: { userId, type: '50/50' } });
  };

  const useTimeFreeze = () => {
    if (!powerups.freeze) return;
    setTimerDuration(45); // Adds 15 seconds locally
    setPowerups(prev => ({ ...prev, freeze: false }));
    channelRef.current?.send({ type: 'broadcast', event: 'powerup_used', payload: { userId, type: 'Time Freeze' } });
  };

  const useDoubleJeopardy = () => {
    if (!powerups.double) return;
    setDoubleJeopardyActive(true);
    setPowerups(prev => ({ ...prev, double: false }));
    channelRef.current?.send({ type: 'broadcast', event: 'powerup_used', payload: { userId, type: 'Double Jeopardy' } });
  };

  // --- EMOTES & UI FX ---
  const sendEmote = (emoji) => {
    triggerEmote(emoji, 'me');
    channelRef.current?.send({ type: 'broadcast', event: 'emote', payload: { userId, emoji } });
  };

  const triggerEmote = (emoji, sender) => {
    const id = Date.now() + Math.random();
    setActiveEmotes(prev => [...prev, { id, emoji, sender }]);
    setTimeout(() => {
      setActiveEmotes(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  const showBattleMessage = (msg) => {
    setBattleMessage(msg);
    setTimeout(() => setBattleMessage(""), 2500);
  };

  // Renders
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

  if (gameStatus === "waiting_for_opponent") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
         <Loader2 className="animate-spin w-16 h-16 text-blue-500 mb-6" />
         <h2 className="text-3xl font-bold text-slate-200 mb-2">You Finished!</h2>
         <p className="text-xl text-slate-400 animate-pulse">Waiting for {opponentName} to finish...</p>
      </div>
    );
  }

  if (gameStatus === "ended") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl text-center max-w-lg w-full relative overflow-hidden">
          {myScore === opponentScore && (
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
          )}
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
      </div>
    );
  }

  const currentQ = matchData.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-10 text-white overflow-hidden relative">
      
      {/* Floating Battle Messages */}
      {battleMessage && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-blue-600/90 text-white px-6 py-2 rounded-full font-black text-xl shadow-[0_0_20px_rgba(37,99,235,0.6)]">
            {battleMessage}
          </div>
        </div>
      )}

      {/* Floating Emotes Layer */}
      {activeEmotes.map(emote => (
        <div key={emote.id} className={`absolute z-40 text-4xl animate-in slide-in-from-bottom-10 fade-in duration-500 ease-out ${emote.sender === 'me' ? 'left-10 bottom-32' : 'right-10 top-32'}`}>
          {emote.emoji}
        </div>
      ))}

      <div className="max-w-4xl mx-auto flex justify-between items-center bg-slate-900/50 backdrop-blur p-4 rounded-2xl border border-slate-700/50 mb-8 sticky top-4 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/50 relative">
             <span className="font-bold text-blue-400">P1</span>
             {myCombo >= 2 && <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-1 rounded animate-pulse">{myCombo}x</span>}
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
          <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/50 relative">
             <span className="font-bold text-red-400">P2</span>
             {opponentCombo >= 2 && <span className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs font-bold px-1 rounded animate-pulse">{opponentCombo}x</span>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
           <div className={`h-full transition-all duration-300 ${currentQIndex === 7 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${((currentQIndex) / 7) * 100}%` }}></div>
        </div>

        <div className="flex justify-between items-start mb-8 mt-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded border mb-3 text-xs font-bold uppercase tracking-wider ${currentQIndex === 7 ? 'bg-red-900/30 border-red-500/50 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
               {currentQIndex === 7 ? '🔥 TIE-BREAKER' : currentQ.subject}
            </div>
            <p className="text-slate-500 font-medium">
              {currentQIndex === 7 ? "Sudden Death" : `Question ${currentQIndex + 1} of 7`}
            </p>
          </div>
          
          <PvPTimer key={`${currentQIndex}-${timerDuration}`} duration={timerDuration} questionIndex={currentQIndex} onTimeUp={handleTimeUp} />
        </div>
        
        <h2 className="text-2xl font-semibold mb-10 leading-relaxed text-slate-100">
          {doubleJeopardyActive && <span className="text-yellow-400 font-black mr-2">[2X POINTS]</span>}
          {currentQ.text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((opt) => {
            if (hiddenOptions.includes(opt.id)) return <div key={opt.id} className="p-6 border-2 border-slate-800/50 bg-slate-900/30 rounded-2xl opacity-20 cursor-not-allowed"></div>;
            return (
              <button
                key={opt.id} onClick={() => handleAnswer(opt.id)}
                className={`group relative bg-slate-950 border-2 border-slate-800 hover:border-blue-500 hover:bg-slate-900 p-6 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${doubleJeopardyActive ? 'hover:border-yellow-500' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-500/20 group-hover:text-blue-400 flex items-center justify-center font-bold text-slate-500 transition-colors ${doubleJeopardyActive ? 'group-hover:text-yellow-400 group-hover:bg-yellow-500/20' : ''}`}>
                    {opt.id}
                  </span> 
                  <span className="text-lg text-slate-300 group-hover:text-white pt-1">{opt.text}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Action Bar (Powerups & Emotes) */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-800 gap-4">
          <div className="flex gap-2">
            <button onClick={useFiftyFifty} disabled={!powerups.fifty} className="flex items-center gap-1 px-3 py-2 bg-slate-800 rounded-lg text-sm font-bold text-slate-300 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition">
               <Target size={16}/> 50/50
            </button>
            <button onClick={useTimeFreeze} disabled={!powerups.freeze} className="flex items-center gap-1 px-3 py-2 bg-slate-800 rounded-lg text-sm font-bold text-slate-300 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition">
               <Snowflake size={16}/> Freeze
            </button>
            <button onClick={useDoubleJeopardy} disabled={!powerups.double} className="flex items-center gap-1 px-3 py-2 bg-slate-800 rounded-lg text-sm font-bold text-slate-300 hover:bg-yellow-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition">
               <Zap size={16}/> 2x Risk
            </button>
          </div>
          
          <div className="flex gap-2 bg-slate-950 p-2 rounded-full border border-slate-800">
            {EMOTES.map(e => (
              <button key={e} onClick={() => sendEmote(e)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-xl transition">
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}