const axios = require('axios');
const { getYesterdayDate } = require('../utils/dateUtils');

// ... existing code ...

// Function to fetch volleyball data
const fetchVolleyballData = async (date) => {
    console.log('Fetching volleyball data...');
    console.log('Using API Key:', process.env.SPORTS_API_KEY);
    const response = await axios.get(`https://v1.volleyball.api-sports.io/games`, {
        params: { date },
        headers: {
            'x-rapidapi-key': process.env.SPORTS_API_KEY,
            'x-rapidapi-host': 'v1.volleyball.api-sports.io'
        }
    });
    return response.data;
};

// Function to fetch AFL data
const fetchAFLData = async (date) => {
    console.log('Fetching AFL data...');
    console.log('Using API Key:', process.env.SPORTS_API_KEY);
    const response = await axios.get(`https://v1.afl.api-sports.io/games`, {
        params: { date },
        headers: {
            'x-rapidapi-key': process.env.SPORTS_API_KEY,
            'x-rapidapi-host': 'v1.afl.api-sports.io'
        }
    });
    return response.data;
};

// Function to fetch Formula 1 data
const fetchFormula1Data = async (date) => {
    console.log('Fetching Formula 1 data...');
    console.log('Using API Key:', process.env.SPORTS_API_KEY);
    const response = await axios.get(`https://v1.formula-1.api-sports.io/races`, {
        params: { date },
        headers: {
            'x-rapidapi-key': process.env.SPORTS_API_KEY,
            'x-rapidapi-host': 'v1.formula-1.api-sports.io'
        }
    });
    return response.data;
};

// Function to fetch MMA data
const fetchMMAData = async (date) => {
    console.log('Fetching MMA data...');
    console.log('Using API Key:', process.env.SPORTS_API_KEY);
    const response = await axios.get(`https://v1.mma.api-sports.io/fights`, {
        params: { date },
        headers: {
            'x-rapidapi-key': process.env.SPORTS_API_KEY,
            'x-rapidapi-host': 'v1.mma.api-sports.io'
        }
    });
    return response.data;
};

// Function to fetch NFL data
const fetchNFLData = async (date) => {
    console.log('Fetching NFL data...');
    console.log('Using API Key:', process.env.SPORTS_API_KEY);
    const response = await axios.get(`https://v1.american-football.api-sports.io/games`, {
        params: { date },
        headers: {
            'x-rapidapi-key': process.env.SPORTS_API_KEY,
            'x-rapidapi-host': 'v1.american-football.api-sports.io'
        }
    });
    return response.data;
};

// Function to fetch yesterday's data for all sports
const fetchYesterdayData = async () => {
    const yesterday = getYesterdayDate();
    const results = {};

    try {
        results.volleyball = await fetchVolleyballData(yesterday);
        results.afl = await fetchAFLData(yesterday);
        results.formula1 = await fetchFormula1Data(yesterday);
        results.mma = await fetchMMAData(yesterday);
        results.nfl = await fetchNFLData(yesterday);
        // ... existing sports ...

        return results;
    } catch (error) {
        console.error('Error fetching yesterday\'s data:', error);
        throw error;
    }
};

module.exports = {
    // ... existing exports ...
    fetchVolleyballData,
    fetchAFLData,
    fetchFormula1Data,
    fetchMMAData,
    fetchNFLData,
    fetchYesterdayData
}; 