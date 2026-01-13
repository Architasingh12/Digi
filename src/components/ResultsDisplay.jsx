import React from 'react';
import { Award, CheckCircle, Info, Star, TrendingUp, BarChart, Download } from 'lucide-react';

const ResultsDisplay = ({ results }) => {
    const data = results.result;
    const competencies = {
        ...data.digital_competence,
        ...data.digital_mindset
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'var(--success)';
        if (score >= 70) return 'var(--primary)';
        if (score >= 50) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div className="results-display">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: '#f0fdf4', borderRadius: '50%', marginBottom: '1.5rem' }}>
                    <Award size={48} color="var(--success)" />
                </div>
                <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assessment Complete</h1>
                <p style={{ color: 'var(--text-muted)' }}>Session ID: {data.session_id}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <TrendingUp size={24} color="var(--primary)" />
                        <h3 className="font-display">Overall Digital Adaptability</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '3rem', fontWeight: '800', color: getScoreColor(data.digital_adaptability.score) }}>{data.digital_adaptability.score}%</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Composite Score</span>
                    </div>
                </div>

                <div className="card glass" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Star size={24} color="var(--warning)" />
                        <h3 className="font-display">AI Confidence Score</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontSize: '3rem', fontWeight: '800' }}>{(results.result.confidence * 100).toFixed(0)}%</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Evaluation Accuracy</span>
                    </div>
                </div>
            </div>

            <h2 className="font-display" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart size={24} /> Competency Breakdown
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(competencies).map(([name, details]) => (
                    <div key={name} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: '700', color: 'var(--text-main)' }}>{name}</h4>
                            <span style={{ fontWeight: '800', color: getScoreColor(details.score), fontSize: '1.25rem' }}>{details.score}%</span>
                        </div>

                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <div style={{ height: '100%', width: `${details.score}%`, background: getScoreColor(details.score), borderRadius: '4px', transition: 'width 1s ease-out' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    <CheckCircle size={14} /> Evidence Found
                                </div>
                                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                    {details.evidence.map((ev, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{ev}</li>)}
                                </ul>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    <Info size={14} /> Rationale
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{details.rationale}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', border: '1px dashed var(--border)' }}>
                <h3 className="font-display" style={{ marginBottom: '1rem' }}>Overall Feedback</h3>
                <p style={{ fontSize: '1.125rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                    {data.overall_comments}
                </p>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                    <Download size={20} /> Download Report (PDF)
                </button>
            </div>
        </div>
    );
};

export default ResultsDisplay;
