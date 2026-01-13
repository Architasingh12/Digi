import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { portalServices } from '../services/portalApi';

const AddParticipantModal = ({ isOpen, onClose, onAdded }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        designation: '',
        user_id: '',
        section: 'Caselet (First your Caselet assessment then BEI)',
        industry: '',
        geography: '',
        company: '',
        function: '',
        division: '',
        level: 'Level 1 - Entry-Level/Associates',
        status: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateUserId = () => {
        const id = Math.random().toString(36).substring(2, 10).toUpperCase() +
            Math.random().toString(36).substring(2, 6).toUpperCase();
        const formattedId = `${id.substring(0, 4)}-${id.substring(4, 8)}-${id.substring(8, 12)}`;
        setFormData(prev => ({ ...prev, user_id: formattedId }));
    };

    useEffect(() => {
        if (isOpen) {
            generateUserId();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await portalServices.createParticipant(formData);
            onAdded && onAdded();
            onClose();
            setFormData({
                firstname: '', lastname: '', email: '', password: '', designation: '',
                user_id: '', section: 'Caselet (First your Caselet assessment then BEI)',
                industry: '', geography: '', company: '', function: '', division: '',
                level: 'Level 1 - Entry-Level/Associates', status: true
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create participant');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-2xl font-bold text-slate-800">Add New Participant</h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-8 custom-scrollbar">
                        <form id="add-participant-form" onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Basic Information Section */}
                            <div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-6">BASIC INFORMATION</h3>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-600 block">First Name *</label>
                                            <input type="text" name="firstname" required value={formData.firstname} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none text-slate-700 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-600 block">Last Name *</label>
                                            <input type="text" name="lastname" required value={formData.lastname} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none text-slate-700 transition-all font-medium" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">Email *</label>
                                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none text-slate-700 transition-all font-medium" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">Password *</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none text-slate-700 transition-all font-medium" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">Designation</label>
                                        <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/5 outline-none text-slate-700 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            {/* Assessment Setup Section */}
                            <div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mb-6">ASSESSMENT SETUP</h3>
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">User ID *</label>
                                        <div className="relative flex items-center">
                                            <input type="text" readOnly value={formData.user_id} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono text-xs font-semibold pr-20" />
                                            <span className="absolute right-3 px-2.5 py-1 bg-[#F5F3FF] text-[#7C3AED] text-[10px] font-black rounded-lg uppercase tracking-wider">New</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">Section *</label>
                                        <div className="relative">
                                            <select name="section" value={formData.section} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium appearance-none">
                                                <option>Caselet (First your Caselet assessment then BEI)</option>
                                                <option>BEI Only</option>
                                                <option>Caselet Only</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-600 block">Industry *</label>
                                            <input type="text" name="industry" required value={formData.industry} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-600 block">Geography *</label>
                                            <input type="text" name="geography" required value={formData.geography} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">Company *</label>
                                        <input type="text" name="company" required value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-600 block">Function *</label>
                                            <input type="text" name="function" required value={formData.function} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-600 block">Division *</label>
                                            <input type="text" name="division" required value={formData.division} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-600 block">Level *</label>
                                        <div className="relative">
                                            <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium appearance-none">
                                                <option>Level 1 - Entry-Level/Associates</option>
                                                <option>Level 2 - Junior Management</option>
                                                <option>Level 3 - Middle Management</option>
                                                <option>Level 4 - Senior Management</option>
                                                <option>Level 5 - Top Management</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="relative flex items-center flex-shrink-0">
                                            <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} className="w-5 h-5 text-[#6366F1] rounded-lg border-slate-200 focus:ring-[#6366F1] cursor-pointer transition-all" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 cursor-pointer select-none" onClick={() => setFormData(p => ({ ...p, status: !p.status }))}>Active Account</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-slate-100 bg-white flex flex-row-reverse gap-4 sticky bottom-0 z-10">
                        <button form="add-participant-form" type="submit" disabled={loading} className="px-10 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-70 text-sm">
                            {loading ? 'Saving...' : 'Save Participant'}
                        </button>
                        <button type="button" onClick={onClose} className="px-10 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all text-sm">
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </AnimatePresence>
    );
};

export default AddParticipantModal;
