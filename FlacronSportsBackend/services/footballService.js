const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const API_KEY = process.env.SPORTS_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

async function getGamesByDate(date) {
  try {
    console.log('Using API Key:', API_KEY); // Debug log
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      params: {
        date: date,
        status: 'FT' // Optional: filter for finished matches
      },
      headers: {
        'x-apisports-key': API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching football matches:', error.response?.data || error.message);
    throw error;
  }
}

async function getYesterdayMatches() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    return await getGamesByDate(dateStr);
  } catch (error) {
    console.error('Error fetching yesterday\'s matches:', error);
    throw new Error('Failed to fetch yesterday\'s matches');
  }
}

module.exports = {
  getGamesByDate,
  getYesterdayMatches
}; 