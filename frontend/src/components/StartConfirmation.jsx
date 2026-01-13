import React, { useState } from 'react';
import { CheckCircle, LogOut, ChevronDown, Play, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../portal/contexts/AuthContext';
import { startSession } from '../services/api';

const StartConfirmation = ({ onStart }) => {
    const { user, logout } = useAuth();
    const [duration, setDuration] = useState(1200); // Default 20 mins
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateUUID = () => {
        try {
            return crypto.randomUUID();
        } catch (e) {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    };

    const handleStart = async () => {
        setLoading(true);
        setError(null);
        try {
            // Find level number by looking for "Level X" in the string
            let numericLevel = 3;
            if (user?.level) {
                if (user.level.includes('Level 1')) numericLevel = 1;
                else if (user.level.includes('Level 2')) numericLevel = 2;
                else if (user.level.includes('Level 3')) numericLevel = 3;
                else if (user.level.includes('Level 4')) numericLevel = 4;
                else if (user.level.includes('Level 5')) numericLevel = 4;
            }

            // Find section number by looking for keywords
            let numericSection = 3; // Default to Caselet
            if (user?.section) {
                if (user.section.includes('BEI Only')) numericSection = 4;
                else if (user.section.includes('Caselet Only')) numericSection = 3;
                else if (user.section.includes('Caselet') && user.section.includes('BEI')) numericSection = 34;
            }

            // The API REQUIRES a valid UUID. We generate one.
            const sessionUserId = generateUUID();

            // Clean payload - match the working SetupForm structure
            const payload = {
                user_id: sessionUserId,
                section: numericSection === 34 ? 3 : numericSection,
                allocated_seconds: duration,
                meta: {}
            };

            // Only add optional fields if they have values (lowercase defaults like SetupForm)
            if (numericLevel) payload.level = numericLevel;
            if (user?.industry) payload.industry = user.industry.toLowerCase();
            else payload.industry = 'retail';
            if (user?.company) payload.company = user.company;
            else payload.company = 'ExampleCo';
            if (user?.geography) payload.geography = user.geography.toLowerCase();
            else payload.geography = 'india';
            if (user?.function) payload.function = user.function;
            else payload.function = 'Operations';
            if (user?.division) payload.division = user.division;
            else payload.division = 'E-commerce';

            console.log('Attempting to start session with payload:', payload);
            const res = await startSession(payload);
            onStart(res, numericSection, payload.user_id, payload);
        } catch (err) {
            console.error('Failed to start session:', err);
            const errorData = err.response?.data;
            const msg = typeof errorData === 'string'
                ? errorData
                : (errorData?.detail?.[0]?.msg || errorData?.message || err.message);
            setError(`Server Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#D946EF] p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Assessment</h2>
                        <p className="text-xs font-semibold opacity-90">Welcome, {user?.name || 'Archita'}!</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all backdrop-blur-md border border-white/20"
                >
                    Logout
                </button>
            </div>

            {/* Content Area */}
            <div className="p-10 text-center space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-[#1E293B] mb-2 tracking-tight">Ready to begin?</h1>
                    <p className="text-slate-500 font-medium">Select your preferred duration below</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-4 text-left">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                        Set Duration
                    </label>
                    <div className="relative group">
                        <select
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="w-full appearance-none bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-[#1E293B] font-bold focus:outline-none focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 transition-all cursor-pointer"
                        >
                            <option value={1200}>20 Minutes</option>
                            <option value={1800}>30 Minutes</option>
                            <option value={3600}>60 Minutes</option>
                            <option value={5400}>90 Minutes</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] transition-colors pointer-events-none" />
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    disabled={loading}
                    className={`w-full py-5 rounded-2xl font-black text-white text-lg transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 ${loading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:shadow-indigo-200'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Initializing...
                        </>
                    ) : (
                        'Start Assessment'
                    )}
                </button>

                <div className="pt-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        Profile Details Secured & Pre-Configured
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
};

export default StartConfirmation;
