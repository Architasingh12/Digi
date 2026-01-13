import React, { useState } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { startSession, BASE_URL } from '../services/api';

const SetupForm = ({ onStart }) => {
    // Reliable UUID fallback for non-secure contexts
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

    const [formData, setFormData] = useState({
        user_id: generateUUID(),
        section: 3,
        allocated_seconds: 1200,
        level: 3,
        industry: 'retail',
        company: 'ExampleCo',
        geography: 'india',
        function: 'Operations',
        division: 'E-commerce',
        meta: {}
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;
        if (name === 'section') {
            finalValue = parseInt(value);
            // Auto-adjust suggested time to match official defaults
            setFormData(prev => ({
                ...prev,
                section: finalValue,
                allocated_seconds: (finalValue === 3 || finalValue === 34) ? 1200 : 1800
            }));
            return;
        }
        if (name === 'allocated_seconds' || name === 'level') {
            finalValue = value === '' ? null : parseInt(value);
        }
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleGenerateId = () => {
        setFormData(prev => ({ ...prev, user_id: generateUUID() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Clean payload - strictly typed and omitting empty optional fields
            const payload = {
                user_id: formData.user_id,
                section: formData.section === 34 ? 3 : formData.section,
                allocated_seconds: formData.allocated_seconds,
                meta: formData.meta || {}
            };

            const optionalFields = ['level', 'industry', 'company', 'geography', 'function', 'division'];
            optionalFields.forEach(field => {
                if (formData[field] !== null && formData[field] !== '') {
                    payload[field] = formData[field];
                }
            });

            console.log('Starting session with cleaned payload:', payload);
            const res = await startSession(payload);
            console.log('Session started successfully:', res);
            onStart(res, formData.section, formData.user_id, formData);
        } catch (err) {
            console.error('API Error details:', err.response?.data || err.message);
            const errorData = err.response?.data;
            const errorMsg = typeof errorData === 'string'
                ? errorData
                : (errorData?.detail?.[0]?.msg || errorData?.message || err.message);
            setError(`Server Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setup-form">
            <h2 className="font-display" style={{ marginBottom: '1.5rem' }}>Start Assessment</h2>

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="label">User ID:</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            name="user_id"
                            className="input"
                            value={formData.user_id}
                            onChange={handleChange}
                            placeholder="Enter User UUID"
                            required
                        />
                        <button type="button" onClick={handleGenerateId} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Generate New ID">
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">Section:</label>
                    <select name="section" className="select" value={formData.section} onChange={handleChange}>
                        <option value={3}>Section 3 - Caselet (Single Scenario)</option>
                        <option value={4}>Section 4 - BEI (Adaptive Interview)</option>
                        <option value={34}>Full Assessment (Caselet + BEI)</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Level:</label>
                        <select name="level" className="select" value={formData.level} onChange={handleChange}>
                            <option value={1}>Level 1 - Individual Contributor</option>
                            <option value={2}>Level 2 - Team Leader</option>
                            <option value={3}>Level 3 - Middle Manager</option>
                            <option value={4}>Level 4 - Senior Leader</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label">Allocated Time (Seconds):</label>
                        <input type="number" name="allocated_seconds" className="input" value={formData.allocated_seconds} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Industry:</label>
                        <input name="industry" className="input" value={formData.industry} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="label">Company:</label>
                        <input name="company" className="input" value={formData.company} onChange={handleChange} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="label">Geography:</label>
                        <input name="geography" className="input" value={formData.geography} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="label">Function:</label>
                        <input name="function" className="input" value={formData.function} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="label">Division:</label>
                    <input name="division" className="input" value={formData.division} onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                    {loading ? <RefreshCw className="spin" size={20} /> : <><Play size={20} /> Start Session</>}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge" style={{ padding: '0.1rem 0.3rem', fontSize: '0.6rem', background: '#f1f5f9' }}>API</span>
                <code>{BASE_URL}</code>
            </div>
        </div>
    );
};

export default SetupForm;
