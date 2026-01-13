import React, { useState, useEffect } from 'react';
import { Send, FileText, Timer as TimerIcon, CheckCircle, Calendar, Mic, ArrowLeft, Loader2 } from 'lucide-react';
import { getCaselet, getTimeLeft, submitAssessment } from '../services/api';
import { motion } from 'framer-motion';

const CaseletFlow = ({ sessionId, userId, onSubmit }) => {
    const [caselet, setCaselet] = useState(null);
    const [answer, setAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await getCaselet(sessionId);
                setCaselet(res);
                const timeRes = await getTimeLeft(sessionId);
                setTimeLeft(timeRes.remaining_seconds);
            } catch (err) {
                console.error('Failed to init caselet flow:', err);
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

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setSubmitting(true);
        try {
            const res = await submitAssessment(sessionId, {
                user_id: userId,
                text: answer,
                metadata: {}
            });
            onSubmit(res);
        } catch (err) {
            console.error('Submission failed:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] shadow-sm">
                <Loader2 className="w-12 h-12 text-[#7C3AED] animate-spin mb-4" />
                <p className="text-slate-500 font-bold">Loading Case Scenario...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 w-full">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#D946EF] p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold">Section 3 – Caselet</h2>
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
            <div className="p-8 md:p-12 space-y-10 bg-[#F8FAFF]">

                {/* Case Scenario Box */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-tight">
                        Caselet Scenario
                    </h3>
                    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 shadow-sm h-[300px] overflow-y-auto custom-scrollbar relative">
                        <div className="text-[#334155] leading-relaxed font-medium space-y-4 relative z-10 whitespace-pre-wrap">
                            {caselet?.caselet_text || "Scenario text goes here..."}
                        </div>
                    </div>
                </div>

                {/* Response Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-tight">
                            Your Response
                        </h3>
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#F5F3FF] text-[#7C3AED] rounded-lg font-bold text-xs hover:bg-[#EDE9FE] transition-all border border-indigo-100">
                            <Mic className="w-4 h-4" />
                            Start Recording
                        </button>
                    </div>

                    <div className="relative group/textarea">
                        <textarea
                            className="w-full bg-white border-4 border-slate-900 rounded-2xl p-8 text-[#1E293B] font-medium placeholder:text-slate-300 focus:outline-none transition-all min-h-[250px] shadow-sm"
                            placeholder="Write your response here (200-250 words)... or click 'Start Recording' to dictate."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                        <div className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Word count: {wordCount}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 pt-6">
                    <button className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm group min-w-[120px]">
                        ← Back
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !answer.trim()}
                        className={`flex-1 w-full max-w-md py-4 rounded-xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] ${submitting
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-[#94A3B8] hover:bg-slate-500' // Matches the grey button in screenshot
                            }`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Submit Answer"
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

export default CaseletFlow;
