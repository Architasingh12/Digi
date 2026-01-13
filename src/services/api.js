import axios from 'axios';

export const BASE_URL = 'https://api.digiready.thepotentia.com/';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 1. Start Session
export const startSession = async (data) => {
    const response = await api.post('session/start', data);
    return response.data;
};

// 2. Get Caselet (Section 3 Only)
export const getCaselet = async (sessionId) => {
    const response = await api.get(`session/${sessionId}/caselet`);
    return response.data;
};

// 3. Get BEI Questions (Section 4 Only)
export const getBEIQuestions = async (sessionId) => {
    const response = await api.get(`session/${sessionId}/bei-questions`);
    return response.data;
};

// 4. Get Next BEI Question (Section 4 Only)
export const getNextBEIQuestion = async (sessionId, previousAnswer) => {
    const response = await api.post(`session/${sessionId}/bei-next-question`, { previous_answer: previousAnswer });
    return response.data;
};

// 5. Get Time Left
export const getTimeLeft = async (sessionId) => {
    const response = await api.get(`session/${sessionId}/time-left`);
    return response.data;
};

// 6. Submit Final Answer
export const submitAssessment = async (sessionId, data) => {
    const response = await api.post(`session/${sessionId}/submit`, data);
    return response.data;
};

// 7. Get Session Status
export const getSessionStatus = async (sessionId) => {
    const response = await api.get(`session/${sessionId}/status`);
    return response.data;
};

// 8. Get Scoring Results
export const getResults = async (sessionId, scoringJobId) => {
    const response = await api.get(`session/${sessionId}/results/${scoringJobId}`);
    return response.data;
};

export default {
    startSession,
    getCaselet,
    getBEIQuestions,
    getNextBEIQuestion,
    getTimeLeft,
    submitAssessment,
    getSessionStatus,
    getResults,
};
