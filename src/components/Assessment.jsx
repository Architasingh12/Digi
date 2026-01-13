import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Timer, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';
import SetupForm from './SetupForm';
import CaseletFlow from './CaseletFlow';
import BEIFlow from './BEIFlow';
import StatusPolling from './StatusPolling';
import ResultsDisplay from './ResultsDisplay';

import { startSession } from '../services/api';
import { useAuth } from '../portal/contexts/AuthContext';
import { portalServices } from '../portal/services/portalApi';

const Assessment = () => {
    const { user } = useAuth();
    const [step, setStep] = useState('setup'); // setup, active, polling, results
    const [sessionId, setSessionId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [section, setSection] = useState(3);
    const [isFullFlow, setIsFullFlow] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [results, setResults] = useState(null);
    const [transitioning, setTransitioning] = useState(false);

    const [hasAutoStarted, setHasAutoStarted] = useState(false);

    useEffect(() => {
        if (user && user.role === 'participant' && !hasAutoStarted && step === 'setup') {
            startParticipantSession();
        }
    }, [user, step, hasAutoStarted]);

    const startParticipantSession = async () => {
        setHasAutoStarted(true);
        setTransitioning(true);
        try {
            // Map strings to numeric values as expected by the API
            const levelMap = {
                'Level 1': 1,
                'Level 2': 2,
                'Level 3': 3,
                'Level 4': 4,
                'Level 5': 4 // DigiReady API usually 1-4, clamping 5 to 4
            };

            const sectionMap = {
                'Caselet (First your Caselet assessment then BEI)': 34,
                'BEI Only': 4,
                'Caselet Only': 3
            };

            const numericLevel = levelMap[user.level?.split(' - ')[0]] || 1;
            const numericSection = sectionMap[user.section] || 3;

            const payload = {
                user_id: user.user_id || `PART-${user.id}`,
                section: numericSection === 34 ? 3 : numericSection,
                allocated_seconds: (numericSection === 3 || numericSection === 34) ? 1200 : 1800,
                level: numericLevel,
                industry: user.industry || 'General',
                company: user.company || 'Individual',
                geography: user.geography || 'India',
                function: user.function || 'General',
                division: user.division || 'General',
                meta: {}
            };

            const res = await startSession(payload);
            handleStartSession(res, numericSection, payload.user_id, payload);
        } catch (err) {
            console.error('Auto-start failed:', err);
        } finally {
            setTransitioning(false);
        }
    };

    const handleStartSession = (res, selectedSection, originalUserId, formData) => {
        setSessionId(res.session_id);
        setUserId(originalUserId);
        setInitialFormData(formData);

        if (selectedSection === 34) {
            setIsFullFlow(true);
            setSection(3); // Start with Caselet
        } else {
            setIsFullFlow(false);
            setSection(selectedSection);
        }
        setStep('active');
    };

    const handleSubmission = async (res) => {
        if (isFullFlow && section === 3) {
            setTransitioning(true);
            try {
                // Transition to Section 4
                // Use the same metadata but change section and time
                const payload = {
                    ...initialFormData,
                    section: 4,
                    allocated_seconds: 1800,
                    user_id: userId
                };

                // Clean payload again just in case
                const cleanPayload = {
                    user_id: payload.user_id,
                    section: 4,
                    allocated_seconds: 1800,
                    meta: payload.meta || {}
                };
                ['level', 'industry', 'company', 'geography', 'function', 'division'].forEach(f => {
                    if (payload[f]) cleanPayload[f] = payload[f];
                });

                const nextRes = await startSession(cleanPayload);
                setSessionId(nextRes.session_id);
                setSection(4);
                // Step remains 'active', but section changes
            } catch (err) {
                console.error('Failed to transition to Section 4:', err);
                // Fallback: poll for Section 3 results if 4 fails
                setJobId(res.scoring_job_id);
                setStep('polling');
            } finally {
                setTransitioning(false);
            }
        } else {
            setJobId(res.scoring_job_id);
            setStep('polling');
        }
    };

    const handleResultsReady = async (finalResults) => {
        setResults(finalResults);
        setStep('results');

        // Persist to local database if we have user context
        try {
            if (user && user.role === 'participant') {
                await portalServices.saveAssessment({
                    participant_id: user.id,
                    session_id: sessionId,
                    section: section === 3 && isFullFlow ? 34 : section,
                    results: finalResults.result // DigiReady API response structure
                });
                console.log('Results saved to local database');
            }
        } catch (err) {
            console.error('Failed to save assessment to local database', err);
        }
    };

    return (
        <div className="container">
            <div className="card fade-in">
                <header className="header">
                    <div className="header-title">
                        <Target size={24} />
                        <span>DigiReady Assessment</span>
                    </div>
                    {sessionId && step === 'active' && (
                        <div className="timer-container">
                            {/* Timer component could be injected here */}
                        </div>
                    )}
                </header>

                <main className="content">
                    <AnimatePresence mode="wait">
                        {transitioning && (
                            <motion.div
                                key="transitioning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="loading-state"
                                style={{ textAlign: 'center', padding: '3rem' }}
                            >
                                <RefreshCw className="spin" size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                                <h3 className="font-display">Preparing next stage...</h3>
                                <p className="text-muted">Setting up BEI Adaptive Interview based on your profile.</p>
                            </motion.div>
                        )}

                        {!transitioning && step === 'setup' && (
                            <motion.div
                                key="setup"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <SetupForm onStart={handleStartSession} />
                            </motion.div>
                        )}

                        {!transitioning && step === 'active' && section === 3 && (
                            <motion.div
                                key="section3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                            >
                                <CaseletFlow sessionId={sessionId} userId={userId} onSubmit={handleSubmission} />
                            </motion.div>
                        )}

                        {!transitioning && step === 'active' && section === 4 && (
                            <motion.div
                                key="section4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                            >
                                <BEIFlow sessionId={sessionId} userId={userId} onSubmit={handleSubmission} />
                            </motion.div>
                        )}

                        {!transitioning && step === 'polling' && (
                            <motion.div
                                key="polling"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <StatusPolling sessionId={sessionId} jobId={jobId} onComplete={handleResultsReady} />
                            </motion.div>
                        )}

                        {!transitioning && step === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <ResultsDisplay results={results} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Assessment;
