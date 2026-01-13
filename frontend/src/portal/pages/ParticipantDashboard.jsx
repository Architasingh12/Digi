import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { portalServices } from '../services/portalApi';
import { motion } from 'framer-motion';
import {
    User, Award, Clock, PlayCircle,
    LogOut, CheckCircle, AlertCircle,
    BarChart3, FileText, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParticipantDashboard = () => {
    const { user, logout } = useAuth();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            fetchAssessments();
        }
    }, [user]);

    const fetchAssessments = async () => {
        try {
            const res = await portalServices.getParticipantAssessments(user.id);
            setAssessments(res.data);
        } catch (err) {
            console.error('Failed to fetch assessments', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-gray-200 font-sans selection:bg-teal-500/30">
            {/* Nav */}
            <nav className="border-b border-white/5 bg-[#0a0f18]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-teal-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            DigiReady Portal
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Profile Hero */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 bg-gradient-to-br from-teal-600/20 to-emerald-600/5 border border-teal-500/20 rounded-[2.5rem] p-10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <User className="w-32 h-32" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-4">Candidate Profile</h2>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                                Welcome, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300">
                                    {user?.name}!
                                </span>
                            </h1>

                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Position</p>
                                    <p className="text-white font-semibold">{user?.designation || 'N/A'}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Level</p>
                                    <p className="text-white font-semibold">{user?.level?.split('-')[1] || 'Level 1'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-80 bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-teal-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Quick Status</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/2 rounded-2xl">
                                    <span className="text-sm text-gray-400">Account status</span>
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                        <CheckCircle className="w-3.5 h-3.5" /> Active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/2 rounded-2xl">
                                    <span className="text-sm text-gray-400">Tests taken</span>
                                    <span className="text-sm font-bold text-white">{assessments.length}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/assessment')}
                            className="mt-8 w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-teal-600/20 flex items-center justify-center gap-3 group"
                        >
                            <PlayCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            START ASSESSMENT
                        </button>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Assessment History */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Clock className="w-6 h-6 text-gray-500" />
                                Recent Activity
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-20 text-center text-gray-500 bg-[#111827] rounded-3xl border border-white/5">
                                    Loading history...
                                </div>
                            ) : assessments.length === 0 ? (
                                <div className="py-20 flex flex-col items-center gap-4 bg-[#111827] rounded-3xl border border-white/5 text-center px-6">
                                    <AlertCircle className="w-12 h-12 text-gray-600" />
                                    <div>
                                        <p className="text-lg font-bold text-gray-400">No assessments found</p>
                                        <p className="text-sm text-gray-500">Your results will appear here after you complete a session.</p>
                                    </div>
                                </div>
                            ) : (
                                assessments.map((report, i) => (
                                    <motion.div
                                        key={report.assessment_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-[#111827] border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-teal-500/30 transition-all cursor-pointer shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                                                <span className="text-xs text-gray-500 font-bold uppercase leading-none">Score</span>
                                                <span className="text-xl font-black text-teal-400 leading-tight">
                                                    {Math.round(report.overall_score)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">Section {report.section} Assessment</h4>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(report.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} • Completed
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-teal-400 transition-colors" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ParticipantDashboard;
