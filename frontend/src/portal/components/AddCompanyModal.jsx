import React, { useState } from 'react';
import { X, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portalServices } from '../services/portalApi';

// Comprehensive list of country codes
const COUNTRY_CODES = [
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+1", name: "USA", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+1", name: "Canada", flag: "🇨🇦" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+55", name: "Brazil", flag: "🇧🇷" },
    { code: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+48", name: "Poland", flag: "🇵L" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+40", name: "Romania", flag: "🇷🇴" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+972", name: "Israel", flag: "🇮🇱" },
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+63", name: "Philippines", flag: "🇵H" },
    { code: "+66", name: "Thailand", flag: "🇹H" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+92", name: "Pakistan", flag: "🇵K" },
    { code: "+880", name: "Bangladesh", flag: "🇧D" },
    { code: "+94", name: "Sri Lanka", flag: "🇱K" },
    { code: "+977", name: "Nepal", flag: "🇳P" },
    { code: "+234", name: "Nigeria", flag: "🇳G" },
    { code: "+254", name: "Kenya", flag: "🇰E" },
    { code: "+212", name: "Morocco", flag: "🇲A" },
    { code: "+213", name: "Algeria", flag: "🇩Z" },
].sort((a, b) => a.name.localeCompare(b.name));

const AddCompanyModal = ({ isOpen, onClose, onAdded }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        company_title: '',
        email: '',
        phone: '',
        country_code: '+91',
        password: '',
        license_qty: 10,
        expiry_date: '',
        status: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await portalServices.createCompany(formData);
            onAdded && onAdded();
            onClose();
            setFormData({
                firstname: '', lastname: '', company_title: '', email: '',
                phone: '', country_code: '+91', password: '',
                license_qty: 10, expiry_date: '', status: true
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create company');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedCountry = COUNTRY_CODES.find(c => c.code === formData.country_code) || COUNTRY_CODES[0];

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
                    <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-2xl font-extrabold text-slate-800">Add New Company</h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-10 custom-scrollbar">
                        <form id="add-company-form" onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Name Row */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-600 block">First Name *</label>
                                    <input type="text" name="firstname" required value={formData.firstname} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-300" placeholder="Enter first name" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-600 block">Last Name *</label>
                                    <input type="text" name="lastname" required value={formData.lastname} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-300" placeholder="Enter last name" />
                                </div>
                            </div>

                            {/* Company Title */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-600 block">Company Title *</label>
                                <input type="text" name="company_title" required value={formData.company_title} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-300" placeholder="Enter company name" />
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-600 block">Email *</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-300" placeholder="Enter email address" />
                            </div>

                            {/* Contact Number with Flag Selection */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-600 block">Contact Number *</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 flex items-center gap-1.5 border-r border-slate-200 pr-2 h-6">
                                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                                        <span className="text-sm font-bold text-slate-700">{formData.country_code}</span>
                                        <select
                                            name="country_code"
                                            value={formData.country_code}
                                            onChange={handleChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                        >
                                            {COUNTRY_CODES.map((c, i) => (
                                                <option key={i} value={c.code}>{c.name} ({c.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-24 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-300"
                                        placeholder="Phone number"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-600 block">Password *</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-700 transition-all font-medium placeholder:text-slate-300" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* License Qty and Expiry */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-600 block">License Quantity *</label>
                                    <input type="number" name="license_qty" required min="1" value={formData.license_qty} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-600 block">License Expiry *</label>
                                    <div className="relative">
                                        <input type="date" name="expiry_date" required value={formData.expiry_date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6366F1] outline-none text-slate-700 transition-all font-medium" />
                                    </div>
                                </div>
                            </div>

                            {/* Active Checkbox */}
                            <div className="flex items-center gap-3 pt-2">
                                <div className="relative flex items-center flex-shrink-0">
                                    <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} className="w-5 h-5 text-[#6366F1] rounded-lg border-slate-200 focus:ring-[#6366F1] cursor-pointer transition-all" />
                                </div>
                                <span className="text-sm font-bold text-slate-600 cursor-pointer select-none" onClick={() => setFormData(p => ({ ...p, status: !p.status }))}>Active</span>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-10 py-6 border-t border-slate-100 bg-white flex flex-row-reverse gap-4 sticky bottom-0 z-10">
                        <button form="add-company-form" type="submit" disabled={loading} className="px-10 py-3.5 rounded-xl font-extrabold text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-70 text-sm whitespace-nowrap">
                            {loading ? 'Processing...' : 'Save Company'}
                        </button>
                        <button type="button" onClick={onClose} className="px-10 py-3.5 rounded-xl font-extrabold text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all text-sm">
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
            `}</style>
        </AnimatePresence>
    );
};

export default AddCompanyModal;
