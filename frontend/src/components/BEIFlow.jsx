import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Timer as TimerIcon, ChevronRight, CheckCircle, Calendar, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getBEIQuestions, getNextBEIQuestion, getTimeLeft, submitAssessment } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const BEIFlow = ({ sessionId, userId, onSubmit }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [allAnswers, setAllAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchingNext, setFetchingNext] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getBEIQuestions(sessionId);
                if (res && res.questions && res.questions.length > 0) {
                    const firstQ = res.questions[0];
                    setCurrentQuestion(firstQ);
                    setQuestions([firstQ]);
                }
                const timeRes = await getTimeLeft(sessionId);
                setTimeLeft(timeRes.remaining_seconds);
            } catch (err) {
                console.error('Failed to init BEI flow:', err);
            } finally {
                setLoading(false);
            }
        };
        init();

        const timer = setInterval(async () => {
            try {
                const timeRes = await getTimeLeft(sessionId);
                if (timeRes && timeRes.remaining_seconds !== undefined) {
                    setTimeLeft(timeRes.remaining_seconds);
                }
            } catch (err) {
                console.error('Timer sync failed:', err);
            }
        }, 10000);

        return () => clearInterval(timer);
    }, [sessionId]);

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleNext = async () => {
        if (!currentAnswer.trim()) return;

        const answerData = {
            question_id: currentQuestion?.question_id,
            question_text: currentQuestion?.question_text,
            answer: currentAnswer
        };

        setAllAnswers(prev => [...prev, answerData]);
        setFetchingNext(true);

        try {
            const res = await getNextBEIQuestion(sessionId, currentAnswer);
            if (res && res.question_id) {
                setCurrentQuestion(res);
                setQuestions(prev => [...prev, res]);
                setCurrentAnswer('');
            } else {
                handleFinalSubmit([...allAnswers, answerData]);
            }
        } catch (err) {
            console.error('Failed to get next question:', err);
            handleFinalSubmit([...allAnswers, answerData]);
        } finally {
            setFetchingNext(false);
        }
    };

    const handleFinalSubmit = async (finalAnswers = allAnswers) => {
        let answersToSubmit = [...finalAnswers];
        if (currentAnswer.trim()) {
            answersToSubmit.push({
                question_id: currentQuestion?.question_id,
                question_text: currentQuestion?.question_text,
                answer: currentAnswer
            });
        }

        if (answersToSubmit.length === 0) return;

        setSubmitting(true);
        try {
            const combinedText = answersToSubmit.map(a => `Q: ${a.question_text}\nA: ${a.answer}`).join('\n\n');
            const res = await submitAssessment(sessionId, {
                user_id: userId,
                text: combinedText,
                metadata: { answers: answersToSubmit }
            });
            onSubmit(res);
        } catch (err) {
            console.error('Final submission failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-sm">
                <Loader2 className="w-12 h-12 text-[#7C3AED] animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Initializing Interview...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#D946EF] rounded-t-[2rem] p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold leading-none">Section 4 – BEI</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Adaptive Interview</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                        <Calendar className="w-4 h-4" />
                        {currentDate}
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-inner">
                        <TimerIcon className="w-5 h-5 text-white animate-pulse" />
                        <span className="text-xl font-black tracking-wider">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#F8FAFF] rounded-b-[2rem] p-8 md:p-12 shadow-2xl border-x border-b border-indigo-50">

                {/* Question Area */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-[#1E293B] flex items-center gap-2 uppercase tracking-tight">
                            Current Question
                        </h3>
                        <span className="px-4 py-1.5 bg-indigo-50 text-[#6366F1] rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                            Q {questions.length}
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion?.question_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white border border-indigo-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#7C3AED]" />
                            <div className="text-xl md:text-2xl font-bold text-[#334155] leading-relaxed relative z-10">
                                {currentQuestion?.question_text}
                            </div>

                            {currentQuestion?.suggested_competencies && (
                                <div className="flex gap-2 mt-8 flex-wrap">
                                    {currentQuestion.suggested_competencies.map(comp => (
                                        <span key={comp} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-[1px] border border-slate-100">
                                            {comp}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Response Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-tight">
                        Your Response
                    </h3>

                    <div className="relative group/textarea">
                        <textarea
                            className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 text-[#1E293B] font-medium placeholder:text-slate-300 focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all min-h-[200px] shadow-sm disabled:opacity-50"
                            placeholder="Type your answer here..."
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            disabled={fetchingNext || submitting}
                        />
                        <div className="absolute bottom-6 right-8 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            {allAnswers.length} questions completed
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row justify-end items-center gap-4">
                    <button
                        onClick={() => handleFinalSubmit()}
                        disabled={submitting || fetchingNext || allAnswers.length === 0}
                        className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        Finish & Submit
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={fetchingNext || submitting || !currentAnswer.trim()}
                        className={`w-full sm:w-auto min-w-[240px] px-10 py-4 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${fetchingNext || submitting
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:shadow-indigo-200 shadow-indigo-500/20'
                            }`}
                    >
                        {fetchingNext ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Generating Next...
                            </>
                        ) : submitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                {questions.length >= 5 ? 'Final Next' : 'Next Question'}
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F8FAFC;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                    border: 2px solid #F8FAFC;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </div>
    );
};

export default BEIFlow;
