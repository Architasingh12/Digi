import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { portalServices } from '../services/portalApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Building2, Users, LogOut,
    Search, UserPlus, Pencil, Trash2, X,
    Menu, Plus, Edit2, ClipboardList, Filter, ChevronDown
} from 'lucide-react';
import AddParticipantModal from '../components/AddParticipantModal';
import AddCompanyModal from '../components/AddCompanyModal';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [participants, setParticipants] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

    // Deletion State
    const [deleteConfirm, setDeleteConfirm] = useState({ type: null, id: null });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, cRes, aRes] = await Promise.allSettled([
                portalServices.getParticipants(),
                portalServices.getCompanies(),
                portalServices.getAssessments()
            ]);

            if (pRes.status === 'fulfilled' && Array.isArray(pRes.value.data)) {
                setParticipants(pRes.value.data);
            }
            if (cRes.status === 'fulfilled' && Array.isArray(cRes.value.data)) {
                setCompanies(cRes.value.data);
            }
            if (aRes.status === 'fulfilled' && Array.isArray(aRes.value.data)) {
                setAssessments(aRes.value.data);
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipantsOnly = async () => {
        try {
            const res = await portalServices.getParticipants();
            if (Array.isArray(res.data)) setParticipants(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchCompaniesOnly = async () => {
        try {
            const res = await portalServices.getCompanies();
            if (Array.isArray(res.data)) setCompanies(res.data);
        } catch (err) { console.error(err); }
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            if (deleteConfirm.type === 'participant') {
                await portalServices.deleteParticipant(deleteConfirm.id);
                setParticipants(prev => prev.filter(p => p.participant_id !== deleteConfirm.id));
            } else {
                await portalServices.deleteCompany(deleteConfirm.id);
                setCompanies(prev => prev.filter(c => c.company_id !== deleteConfirm.id));
            }
            setDeleteConfirm({ type: null, id: null });
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Failed to delete.");
        }
    };

    const filteredCompanies = companies.filter(c => {
        const name = (c.company_title || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });

    const filteredParticipants = participants.filter(p => {
        const fullName = `${p.firstname} ${p.lastname}`.toLowerCase();
        const email = (p.email || '').toLowerCase();
        const companyName = (p.company_name || '').toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase()) ||
            companyName.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#7C3AED] text-white flex flex-col fixed h-full z-50">
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-10">DigiReady Admin</h1>

                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-semibold">Dashboard</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('companies')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'companies' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
                        >
                            <Building2 className="w-5 h-5" />
                            <span className="font-semibold">Companies</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('participants')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'participants' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-semibold">Participants</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 text-white/80 hover:text-white transition-colors w-full px-4 py-3"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                <div className="max-w-7xl mx-auto">
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-10">Dashboard</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Total Companies */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Total Companies</p>
                                        <p className="text-4xl font-black text-slate-800">{loading ? '--' : companies.length}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>

                                {/* Total Participants */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Total Participants</p>
                                        <p className="text-4xl font-black text-slate-800">{loading ? '--' : participants.length}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
                                        <Users className="w-8 h-8 text-purple-500" />
                                    </div>
                                </div>

                                {/* Total Quizzes */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Total Quizzes</p>
                                        <p className="text-4xl font-black text-slate-800">{loading ? '--' : assessments.length}</p>
                                    </div>
                                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                                        <ClipboardList className="w-8 h-8 text-orange-500" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* COMPANIES TAB */}
                    {activeTab === 'companies' && (
                        <>
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-bold text-slate-800">Companies</h2>
                                <button
                                    onClick={() => setIsCompanyModalOpen(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-200"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Company
                                </button>
                            </div>

                            <div className="mb-8">
                                <div className="relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search companies..."
                                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-700 font-medium placeholder:text-slate-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-slate-50 bg-slate-50/50">
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Company</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Licenses</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Contact No</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Expiry</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredCompanies.map((item) => (
                                            <tr key={item.company_id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800">{item.company_title}</span>
                                                        <span className="text-xs text-slate-400 font-medium">{item.firstname} {item.lastname}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">{item.email}</td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-bold">{item.license_qty || 0}</td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">{item.phone || 'N/A'}</td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-medium whitespace-nowrap">
                                                    {item.license_expiry ? new Date(item.license_expiry).toLocaleDateString('en-GB') : 'N/A'}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <button className="p-2.5 bg-indigo-50 text-[#6366F1] rounded-xl hover:bg-indigo-100 transition-colors">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm({ type: 'company', id: item.company_id })}
                                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* PARTICIPANTS TAB */}
                    {activeTab === 'participants' && (
                        <>
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-bold text-slate-800">Participants</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-200"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Participant
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search participants..."
                                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-700 font-medium placeholder:text-slate-400"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
                                    <Filter className="w-5 h-5" />
                                    All Companies
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-slate-50 bg-slate-50/50">
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Participant Details</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredParticipants.map((item) => (
                                            <tr key={item.participant_id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-slate-800 mb-1">{item.firstname} {item.lastname}</span>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            <span className="text-[#7C3AED] bg-indigo-50 px-2 py-0.5 rounded-md">{item.level || 'LEVEL 1'}</span>
                                                            <span>•</span>
                                                            <span>{item.email}</span>
                                                            <span>•</span>
                                                            <span>{item.company_name || 'Individual'}</span>
                                                            <span>•</span>
                                                            <span>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <button className="p-2.5 bg-indigo-50 text-[#6366F1] rounded-xl hover:bg-indigo-100 transition-colors">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm({ type: 'participant', id: item.participant_id })}
                                                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Deletion Confirm Modal */}
            <AnimatePresence>
                {deleteConfirm.id && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setDeleteConfirm({ type: null, id: null })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Confirmation</h3>
                            <p className="text-slate-500 mb-8 font-medium">Are you sure you want to delete this {deleteConfirm.type}? This action cannot be undone.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteConfirm({ type: null, id: null })}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AddParticipantModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdded={fetchParticipantsOnly}
            />
            <AddCompanyModal
                isOpen={isCompanyModalOpen}
                onClose={() => setIsCompanyModalOpen(false)}
                onAdded={fetchCompaniesOnly}
            />
        </div>
    );
};

export default AdminDashboard;
