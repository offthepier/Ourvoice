import axios from 'axios';

const recordLoginHistory = async (userId: string, status: string) => {
    try {
        await axios.post('/api/login-history', {
            userId,
            status,
        });
    } catch (error) {
        console.error('Failed to record login history:', error);
    }
};

export default { recordLoginHistory };