'use client'
import { useState } from 'react';
import { submitNodeQuiz, generateDynamicQuiz } from '@/app/actions/skillTreeActions';
import { X, ArrowRight, CheckCircle, XCircle, ShieldAlert, Trophy, Loader2, RotateCcw } from 'lucide-react';

export default function QuizModal({ node, userId, onClose }) {
  // --- STATE ---
  const [step, setStep] = useState('intro'); // 'intro', 'quiz', 'results'
  const [questions, setQuestions] = useState([]); 
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const PASS_THRESHOLD = 60; 
  const isMastered = node.data.status === 'mastered'; // Check if already passed

  // --- LOGIC ---
  const handleStartTrial = async () => {
    setIsGenerating(true);
    setError('');

    const res = await generateDynamicQuiz(node.data.label, node.data.description);
    
    if (res.success && res.questions) {
      setQuestions(res.questions);
      setStep('quiz');
    } else {
      setError(res.message || "Failed to summon the trial. Try again.");
    }
    
    setIsGenerating(false);
  };

  const handleSelectOption = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optionId
    });
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    setIsSubmitting(true);
    setError('');

    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const hasPassed = scorePercentage >= PASS_THRESHOLD;
    
    setFinalScore(scorePercentage);
    setPassed(hasPassed);
    setStep('results');

    // Submit regardless if they passed previously, to record the new attempt/score
    if (hasPassed) {
      try {
        const res = await submitNodeQuiz(userId, node.id, scorePercentage, hasPassed);
        if (!res.success) {
          setError(res.message);
        }
      } catch (err) {
        setError('Failed to sync progress with server.');
      }
    }
    
    setIsSubmitting(false);
  };

  // --- RENDER HELPERS ---
  const currentQ = questions[currentQIndex];

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    if (diff === 'medium') return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    if (diff === 'hard') return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className={`h-2 w-full shrink-0 ${step === 'results' ? (passed ? 'bg-green-500' : 'bg-red-500') : (isMastered ? 'bg-yellow-500' : 'bg-blue-500')}`}></div>

        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition z-10">
          <X size={24} />
        </button>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* ================= STEP 1: INTRO ================= */}
          {step === 'intro' && (
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isMastered ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {isMastered ? <RotateCcw size={32} /> : <ShieldAlert size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isMastered ? `Practice: ${node.data.label}` : `Challenge: ${node.data.label}`}
              </h2>
              <p className="text-slate-400 mb-6">
                {node.data.description}
                <br /><br />
                The system will generate a custom trial of <strong>11 questions</strong> (5 Easy, 3 Medium, 3 Hard).
                You must score at least <strong>{PASS_THRESHOLD}%</strong> to pass.
                {isMastered && <span className="block mt-4 text-yellow-400/90 font-medium">You have already mastered this node. Practice again to hone your skills!</span>}
              </p>
              
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="flex gap-4">
                <button 
                  onClick={onClose} 
                  disabled={isGenerating}
                  className="flex-1 py-3 rounded-xl font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Retreat
                </button>
                <button 
                  onClick={handleStartTrial} 
                  disabled={isGenerating}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition shadow-[0_0_15px_rgba(0,0,0,0.2)] disabled:opacity-70 flex justify-center items-center gap-2 ${isMastered ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
                >
                  {isGenerating ? <><Loader2 className="animate-spin" size={20} /> Generating...</> : (isMastered ? 'Practice Again' : 'Start Trial')}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: QUIZ ================= */}
          {step === 'quiz' && currentQ && (
            <div className="flex flex-col h-full">
              <div className="mb-6 flex justify-between items-center text-sm font-semibold text-slate-400 border-b border-slate-800 pb-4">
                <span>{node.data.label}</span>
                <span>Question {currentQIndex + 1} of {questions.length}</span>
              </div>

              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="text-lg font-medium text-white flex-1">
                  {currentQ.text}
                </h3>
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded border ${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty}
                </span>
              </div>

              <div className="space-y-3 flex-1 mb-6">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                      selectedAnswers[currentQIndex] === opt.id
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
                    }`}
                  >
                    <span className="inline-block w-6 font-bold text-slate-500 uppercase">{opt.id}.</span> 
                    {opt.text}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end mt-auto">
                <button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQIndex] || isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Evaluating...' : currentQIndex === questions.length - 1 ? 'Submit Answers' : 'Next Question'}
                  {!isSubmitting && currentQIndex !== questions.length - 1 && <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: RESULTS ================= */}
          {step === 'results' && (
            <div className="text-center animate-in zoom-in-95 duration-300">
              {passed ? (
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={40} />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={40} />
                </div>
              )}

              <h2 className="text-3xl font-bold text-white mb-2">
                {passed ? (isMastered ? 'Skill Honed!' : 'Node Mastered!') : 'Trial Failed'}
              </h2>
              
              <p className="text-slate-400 mb-6">
                You scored <span className={`font-bold text-lg ${passed ? 'text-green-400' : 'text-red-400'}`}>{finalScore}%</span>
              </p>

              {error && <p className="text-red-400 text-sm mb-4 bg-red-900/20 p-3 rounded-lg">{error}</p>}

              <div className="bg-slate-800 rounded-xl p-4 mb-8 text-left space-y-4 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 sticky top-0 bg-slate-800 py-1">Review</h4>
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex items-start gap-3 text-sm pb-3 border-b border-slate-700/50 last:border-0">
                    {selectedAnswers[idx] === q.correctAnswer ? (
                      <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${getDifficultyColor(q.difficulty)}`}>
                           {q.difficulty}
                         </span>
                      </div>
                      <p className="text-slate-200">{q.text}</p>
                      <p className="text-slate-500 text-xs mt-1">
                        Correct Answer: {q.options.find(o => o.id === q.correctAnswer)?.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={onClose}
                className={`w-full py-4 rounded-xl font-bold text-white transition shadow-lg ${
                  passed ? 'bg-green-600 hover:bg-green-500 shadow-green-900/50' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {passed ? 'Return to Map' : 'Study and Try Again'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}