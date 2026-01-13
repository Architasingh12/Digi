import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { getSessionStatus, getResults } from '../services/api';

const StatusPolling = ({ sessionId, jobId, onComplete }) => {
    const [status, setStatus] = useState('processing'); // processing, fetching, error
    const [error, setError] = useState(null);

    useEffect(() => {
        let interval;
        const poll = async () => {
            try {
                const res = await getSessionStatus(sessionId);
                if (res.scoring_status === 'done') {
                    clearInterval(interval);
                    setStatus('fetching');
                    const finalResults = await getResults(sessionId, jobId);
                    onComplete(finalResults);
                }
            } catch (err) {
                console.error('Polling failed:', err);
                setError('Connection lost. Still trying to fetch your results...');
            }
        };

        poll(); // Initial check
        interval = setInterval(poll, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [sessionId, jobId, onComplete]);

    return (
        <div className="status-polling" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                {status === 'processing' ? (
                    <Loader2 size={64} className="spin" style={{ color: 'var(--primary)' }} />
                ) : (
                    <RefreshCw size={64} className="spin" style={{ color: 'var(--secondary)' }} />
                )}
            </div>

            <h2 className="font-display" style={{ marginBottom: '1rem' }}>
                {status === 'processing' ? 'Analyzing your responses...' : 'Finalizing your report...'}
            </h2>

            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                Our AI is evaluating your competencies based on the DigiReady framework. This usually takes 30-60 seconds.
            </p>

            {error && (
                <div style={{ marginTop: '2rem', color: 'var(--warning)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={16} /> {error}
                </div>
            )}

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)', opacity: 0.3, animationDelay: `${i * 0.2}s` }} />
                ))}
            </div>

            <style>{`
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.5); opacity: 0.7; } }
      `}</style>
        </div>
    );
};

export default StatusPolling;
