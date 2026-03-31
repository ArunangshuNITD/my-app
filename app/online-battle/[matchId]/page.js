"use client";
import { useEffect, useState, use, useRef } from "react"; 
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import { submitMatchResults, cancelMatch, savePlayerAnswer, handleSuddenDeathAnswer } from "@/app/actions/pvpActions"; 
import { Loader2, Swords, X, Clock, Flame, Zap, Hourglass, DivideCircle, SmilePlus } from "lucide-react";

export default function LivePvPBoard({ params }) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.matchId;

  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId"); 
  const userName = searchParams.get("userName") || "You"; 

  const [matchData, setMatchData] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  // Score and Combo States
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myCombo, setMyCombo] = useState(0);
  const [opponentCombo, setOpponentCombo] = useState(0);

  // Bonus Notification State
  const [showBonus, setShowBonus] = useState(false);
  const [bonusText, setBonusText] = useState("");
  const [opponentNotification, setOpponentNotification] = useState("");
  
  const [gameStatus, setGameStatus] = useState("loading"); 
  const [opponentName, setOpponentName] = useState("Opponent");
  const [isReady, setIsReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  
  // Built-in Timer State
  const [qTimeLeft, setQTimeLeft] = useState(30);
  const [matchmakingTimeLeft, setMatchmakingTimeLeft] = useState(60);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  // Power-Ups State
  const [usedPowerUps, setUsedPowerUps] = useState({ fiftyFifty: false, timeFreeze: false, doubleJeopardy: false });
  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);
  const [doubleJeopardyActive, setDoubleJeopardyActive] = useState(false);

  // Emotes State
  const [floatingEmotes, setFloatingEmotes] = useState([]);

  const channelRef = useRef(null);

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
      .on('broadcast', { event: 'question_answered' }, (payload) => {
        if (payload.userId !== userId) {
          setOpponentNotification(`${opponentName} just locked in an answer!`);
          setTimeout(() => setOpponentNotification(""), 3000);
        }
      })
      .on('broadcast', { event: 'emote' }, (payload) => {
        if (payload.userId !== userId) triggerEmoteDisplay(payload.emoji, false);
      })
      .on('broadcast', { event: 'sudden_death_started' }, () => {
        setGameStatus("playing");
        setCurrentQIndex(7); // Jump to the 8th Tie-Breaker question
        setQTimeLeft(30);
        setQuestionStartTime(Date.now());
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
      .on('broadcast', { event: 'match_completed' }, (payload) => {
        renderFinalResults(payload.match);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({ type: 'broadcast', event: 'player_joined', payload: { userId, userName } });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [matchId, userId, userName, opponentName, router]); 

  // Matchmaking Timer
  useEffect(() => {
    if (gameStatus !== "waiting") return;
    const timer = setInterval(() => {
      setMatchmakingTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleMatchmakingTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus]);

  // In-Game Question Timer (Supports Time Freeze)
  useEffect(() => {
    if (gameStatus !== "playing" || isTimeFrozen) return;
    const timer = setInterval(() => {
      setQTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleTimeUp(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStatus, isTimeFrozen, currentQIndex]);

  const handleMatchmakingTimeout = async () => {
    await cancelMatch(matchId); 
    alert("Opponent not found. Please try again later!");
    router.push('/online-battle');
  };

  useEffect(() => {
    if (isReady && opponentReady) {
      setGameStatus("playing");
      setQuestionStartTime(Date.now()); 
    }
  }, [isReady, opponentReady]);

  const handleReady = () => {
    setIsReady(true);
    channelRef.current?.send({ type: 'broadcast', event: 'player_ready', payload: { userId } });
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

    if (res.suddenDeath) {
      // Tie Breaker Activated!
      channelRef.current?.send({ type: 'broadcast', event: 'sudden_death_started', payload: {} });
      setGameStatus("playing");
      setCurrentQIndex(7); // Question 8
      setQTimeLeft(30);
      setQuestionStartTime(Date.now());
    } else if (res.success && res.isComplete) {
      channelRef.current?.send({ type: 'broadcast', event: 'match_completed', payload: { match: res.match } });
      renderFinalResults(res.match);
    }
  };

  const moveToNextQuestion = (currentScore) => {
    setHiddenOptions([]);
    setDoubleJeopardyActive(false);
    
    // Total standard questions is 7 (indexes 0 to 6). 
    if (currentQIndex < 6) {
      setCurrentQIndex(currentQIndex + 1);
      setQTimeLeft(30);
      setQuestionStartTime(Date.now()); 
    } else {
      handleEndGame(currentScore);
    }
  };

  const handleTimeUp = async () => {
    setMyCombo(0);
    setShowBonus(false);
    
    channelRef.current?.send({
      type: 'broadcast', event: 'score_update', payload: { userId, score: myScore, combo: 0 }
    });
    channelRef.current?.send({
      type: 'broadcast', event: 'question_answered', payload: { userId }
    });

    if (currentQIndex === 7) {
      // Timeout on sudden death acts as a wrong answer
      const res = await handleSuddenDeathAnswer(matchId, userId, false);
      if (res.isComplete) {
        channelRef.current?.send({ type: 'broadcast', event: 'match_completed', payload: { match: res.match } });
        renderFinalResults(res.match);
      } else {
        setGameStatus("waiting_for_opponent");
      }
      return;
    }

    await savePlayerAnswer(matchId, userId, { questionIndex: currentQIndex, selectedOption: null, timeTaken: 30 });
    moveToNextQuestion(myScore);
  };

  const handleAnswer = async (optionId) => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = matchData.questions[currentQIndex].correctAnswer === optionId;

    channelRef.current?.send({ type: 'broadcast', event: 'question_answered', payload: { userId } });

    // --- SUDDEN DEATH LOGIC ---
    if (currentQIndex === 7) {
      const res = await handleSuddenDeathAnswer(matchId, userId, isCorrect);
      if (res.isComplete) {
        channelRef.current?.send({ type: 'broadcast', event: 'match_completed', payload: { match: res.match } });
        renderFinalResults(res.match);
      } else {
        setGameStatus("waiting_for_opponent");
      }
      return;
    }

    // --- NORMAL LOGIC ---
    let newScore = myScore;
    let newCombo = myCombo;
    
    if (isCorrect) {
      newCombo += 1; 
      let pointsAwarded = 10;
      if (newCombo === 2) {
        pointsAwarded = 12; setBonusText("Combo Streak! 1.2x Points!"); setShowBonus(true);
      } else if (newCombo >= 3) {
        pointsAwarded = 15; setBonusText("On Fire! 1.5x Points!"); setShowBonus(true);
      }
      
      if (doubleJeopardyActive) {
        pointsAwarded *= 2; setBonusText("Double Jeopardy! 2x Points Earned!"); setShowBonus(true);
      }
      
      newScore = myScore + pointsAwarded;
    } else {
      newCombo = 0; 
      setShowBonus(false);
      if (doubleJeopardyActive) {
        newScore = Math.max(0, myScore - 15); // Penalty
        setBonusText("Double Jeopardy Failed! Points Lost."); setShowBonus(true);
        setTimeout(() => setShowBonus(false), 2000);
      }
    }

    setMyScore(newScore);
    setMyCombo(newCombo);
      
    channelRef.current?.send({ type: 'broadcast', event: 'score_update', payload: { userId, score: newScore, combo: newCombo } });

    await savePlayerAnswer(matchId, userId, {
      questionIndex: currentQIndex, selectedOption: optionId, timeTaken: Math.min(timeTaken, 30)
    });

    moveToNextQuestion(newScore);
  };

  // --- POWER-UPS ---
  const activateFiftyFifty = () => {
    if (usedPowerUps.fiftyFifty || !matchData) return;
    setUsedPowerUps(p => ({ ...p, fiftyFifty: true }));
    const currentQ = matchData.questions[currentQIndex];
    const wrongOptions = currentQ.options.filter(o => o.id !== currentQ.correctAnswer);
    // Hide randomly selected 2 wrong options
    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random());
    setHiddenOptions([shuffledWrong[0].id, shuffledWrong[1].id]);
  };

  const activateTimeFreeze = () => {
    if (usedPowerUps.timeFreeze) return;
    setUsedPowerUps(p => ({ ...p, timeFreeze: true }));
    setIsTimeFrozen(true);
    setBonusText("Time Frozen for 10s!"); setShowBonus(true);
    setTimeout(() => { setIsTimeFrozen(false); setShowBonus(false); }, 10000);
  };

  const activateDoubleJeopardy = () => {
    if (usedPowerUps.doubleJeopardy) return;
    setUsedPowerUps(p => ({ ...p, doubleJeopardy: true }));
    setDoubleJeopardyActive(true);
    setBonusText("Double Jeopardy Active! Make it count."); setShowBonus(true);
  };

  // --- EMOTES ---
  const sendEmote = (emoji) => {
    channelRef.current?.send({ type: 'broadcast', event: 'emote', payload: { emoji, userId } });
    triggerEmoteDisplay(emoji, true);
  };

  const triggerEmoteDisplay = (emoji, isMine) => {
    const id = Date.now() + Math.random();
    setFloatingEmotes(prev => [...prev, { id, emoji, isMine }]);
    setTimeout(() => {
      setFloatingEmotes(prev => prev.filter(e => e.id !== id));
    }, 2500);
  };

  if (gameStatus === "loading" || !matchData) return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

  if (gameStatus === "waiting") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="relative w-24 h-24 mb-6">
           <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-200">Searching for Opponent...</h2>
        <div className="flex items-center gap-2 mt-6 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-slate-300">
          <Clock size={16} className="text-blue-400" />
          <span>Timeout in: <span className="font-mono font-bold">{matchmakingTimeLeft}s</span></span>
        </div>
      </div>
    );
  }

  if (gameStatus === "opponent_found") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl text-center max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
          <h2 className="text-3xl font-black text-white mb-2">Match Found!</h2>
          <div className="text-lg font-bold mb-8 flex justify-center items-center gap-3">
             <span className="text-blue-400">{userName}</span>
             <span className="text-slate-500">vs</span>
             <span className="text-red-400">{opponentName}</span>
          </div>
          <button onClick={handleReady} disabled={isReady} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isReady ? "bg-green-600/20 text-green-400 border border-green-500/50" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
            {isReady ? "Waiting for opponent..." : "I'm Ready"}
          </button>
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
        <div className="bg-slate-900 border border-slate-700 p-10 rounded-3xl text-center max-w-lg w-full">
          <h1 className="text-4xl font-black mb-8 text-white">Battle Concluded!</h1>
          <div className="flex justify-around items-center mb-8">
             <div className="text-center">
               <p className="text-slate-400 text-sm mb-1">{userName}</p>
               <p className="text-4xl font-bold text-blue-400">{myScore}</p>
             </div>
             <div className="text-center">
               <p className="text-slate-400 text-sm mb-1">{opponentName}</p>
               <p className="text-4xl font-bold text-red-400">{opponentScore}</p>
             </div>
          </div>
          <button onClick={() => router.push('/online-battle')} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold border border-slate-600">Return to Lobby</button>
        </div>
      </div>
    );
  }

  const currentQ = matchData.questions[currentQIndex];
  const isSuddenDeath = currentQIndex === 7;

  return (
    <div className="min-h-screen bg-slate-950 p-4 pt-10 text-white relative overflow-hidden">
      
      {/* Emotes Overlay */}
      {floatingEmotes.map(emote => (
        <div key={emote.id} className={`fixed text-4xl pointer-events-none z-50 animate-bounce transition-all duration-1000 ease-out translate-y-[-100px] opacity-0 ${emote.isMine ? 'right-10 bottom-24' : 'left-10 top-24'}`} style={{ animation: 'floatUp 2.5s forwards' }}>
          {emote.emoji}
        </div>
      ))}

      {/* Opponent Answered Notification */}
      {opponentNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white px-6 py-2 rounded-full shadow-lg z-50 animate-in slide-in-from-top-4 fade-in duration-300 font-bold border border-blue-400">
          {opponentNotification}
        </div>
      )}

      {/* Bonus Banner Div */}
      {showBonus && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-orange-600 to-red-500 text-white px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] border border-orange-400 flex items-center gap-3 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
          <Flame className="w-6 h-6 animate-pulse text-yellow-300" />
          <div className="font-bold text-sm tracking-wide">{bonusText}</div>
        </div>
      )}

      {/* Header Board */}
      <div className={`max-w-4xl mx-auto flex justify-between items-center bg-slate-900/50 backdrop-blur p-4 rounded-2xl border ${isSuddenDeath ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-slate-700/50'} mb-4 sticky top-4 z-10`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/50"><span className="font-bold text-blue-400">P1</span></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{userName}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-blue-400 leading-none">{myScore}</p>
            </div>
          </div>
        </div>
        <div className={`text-2xl font-black italic ${isSuddenDeath ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
          {isSuddenDeath ? "SUDDEN DEATH" : "VS"}
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col items-end">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{opponentName}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-red-400 leading-none">{opponentScore}</p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/50"><span className="font-bold text-red-400">P2</span></div>
        </div>
      </div>

      {/* Lifelines Bar (Disabled during Sudden Death) */}
      {!isSuddenDeath && (
        <div className="max-w-4xl mx-auto mb-6 flex justify-center gap-4">
          <button onClick={activateFiftyFifty} disabled={usedPowerUps.fiftyFifty} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${usedPowerUps.fiftyFifty ? 'bg-slate-800 text-slate-600' : 'bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600/40'}`}>
            <DivideCircle size={16} /> 50/50
          </button>
          <button onClick={activateTimeFreeze} disabled={usedPowerUps.timeFreeze} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${usedPowerUps.timeFreeze ? 'bg-slate-800 text-slate-600' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-600/40'}`}>
            <Hourglass size={16} /> Freeze Time
          </button>
          <button onClick={activateDoubleJeopardy} disabled={usedPowerUps.doubleJeopardy} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${usedPowerUps.doubleJeopardy ? 'bg-slate-800 text-slate-600' : 'bg-orange-600/20 text-orange-400 border border-orange-500/50 hover:bg-orange-600/40'}`}>
            <Zap size={16} /> 2x Jeopardy
          </button>
        </div>
      )}

      {/* Main Question Card */}
      <div className={`max-w-4xl mx-auto bg-slate-900 border rounded-3xl p-8 shadow-2xl relative overflow-hidden ${isSuddenDeath ? 'border-red-600 bg-red-950/20' : 'border-slate-700'}`}>
        {!isSuddenDeath && (
          <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentQIndex) / 7) * 100}%` }}></div>
          </div>
        )}

        <div className="flex justify-between items-start mb-8 mt-4">
          <div>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded border mb-3 text-xs font-bold uppercase tracking-wider ${isSuddenDeath ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
               {isSuddenDeath ? "TIE-BREAKER" : currentQ.subject}
            </div>
            <p className="text-slate-500 font-medium">Question {currentQIndex + 1} {isSuddenDeath ? "" : "of 7"}</p>
          </div>
          
          {/* Custom In-line Timer */}
          <div className={`flex items-center justify-center w-14 h-14 rounded-full border-4 font-black text-xl ${isTimeFrozen ? 'border-cyan-500 text-cyan-400 animate-pulse' : qTimeLeft <= 5 ? 'border-red-500 text-red-500 animate-bounce' : 'border-blue-500 text-blue-400'}`}>
            {qTimeLeft}
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-10 leading-relaxed text-slate-100">{currentQ.text}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.options.map((opt) => {
            if (hiddenOptions.includes(opt.id)) return null; // Hidden by 50/50
            return (
              <button key={opt.id} onClick={() => handleAnswer(opt.id)} className={`group relative bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md ${doubleJeopardyActive ? 'hover:border-orange-500 hover:bg-orange-950/30' : 'hover:border-blue-500 hover:bg-slate-900'}`}>
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 transition-colors ${doubleJeopardyActive ? 'group-hover:bg-orange-500/20 group-hover:text-orange-400' : 'group-hover:bg-blue-500/20 group-hover:text-blue-400'}`}>
                    {opt.id}
                  </span> 
                  <span className="text-lg text-slate-300 group-hover:text-white pt-1">{opt.text}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Emotes Bar */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-2 rounded-full border border-slate-700 shadow-xl z-50">
         <SmilePlus size={20} className="text-slate-400 ml-2" />
         <div className="w-px h-6 bg-slate-700 mx-1"></div>
         {['🤯', '🚀', '😭', '🎯'].map(emoji => (
           <button key={emoji} onClick={() => sendEmote(emoji)} className="text-2xl hover:scale-125 transition-transform p-1">
             {emoji}
           </button>
         ))}
      </div>

      {/* Global CSS animation needed for emotes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
      `}} />
    </div>
  );
}