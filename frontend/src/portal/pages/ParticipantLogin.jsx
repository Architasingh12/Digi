import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ParticipantLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const res = await login(email, password, 'participant');
        if (res.success) {
            navigate('/assessment');
        } else {
            setError(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] px-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-[2.75rem] font-black text-[#1a1a1a] leading-tight mb-1">
                        DigiReady<br />Assessment
                    </h1>
                    <p className="text-[#64748b] text-base font-medium mt-2">Participant Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1a1a1a] block">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl py-3.5 px-5 text-[#1a1a1a] placeholder-[#94a3b8] focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                            placeholder="you@company.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1a1a1a] block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl py-3.5 px-5 text-[#1a1a1a] placeholder-[#94a3b8] focus:outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-base"
                    >
                        {isSubmitting ? 'Signing in...' : 'Start Assessment'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="text-[#7c3aed] font-bold text-sm hover:underline"
                    >
                        Admin Login →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ParticipantLogin;
