const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

const API_KEY = process.env.SPORTS_API_KEY;
const BASE_URL = 'https://v1.hockey.api-sports.io';

async function getGamesByDate(date) {
  try {
    console.log('Using API Key:', API_KEY); // Debug log
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        date: date
      },
      headers: {
        'x-apisports-key': API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching hockey games:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  getGamesByDate
}; 