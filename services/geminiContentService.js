const axios = require('axios');
const config = require('../config/config');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGeminiAPI(prompt) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${config.gemini.apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.candidates || !response.data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    throw error;
  }
}

const generateNewsletterContent = async (sportsData) => {
  const prompt = `You are an AI content writer. Generate separate JSON objects for each match in the sports data. Return multiple JSON objects in one output.

Only return the JSON objects — no introductions, explanations, or additional text. Do not wrap it in code blocks or say anything like "Here's your article". Just output clean, raw JSON objects separated by newlines.

For each match, create a JSON object with this exact structure:

{
  "matchId": "[TeamA vs TeamB]_[YYYY-MM-DD from data]",
  "date": "<YYYY-MM-DD from the data>",
  "title": "<Explanatory title explaining whose match and for what>",
  "sport": "<sport name as passed for filter use>",
  "headline": "<Catchy headline for the match>",
  "hook": "<Engaging hook to draw readers in>",
  "details": "<Detailed analysis of the match with comprehensive information>",
  "stats": {
    "teamA": "<Team A name>",
    "teamB": "<Team B name>",
    "scoreA": "<Team A score>",
    "scoreB": "<Team B score>",
    "venue": "<Venue/Stadium name>",
    "competition": "<League/Competition name>",
    "attendance": "<Attendance if available>",
    "duration": "<Match duration if available>"
  },
  "keyMoments": ["<Key moment 1>", "<Key moment 2>", "<Key moment 3>", "<Key moment 4>", "<Key moment 5>"],
  "summary": "<Comprehensive summary of the match outcome and significance>"
}

{
  "matchId": "[TeamA vs TeamB]_[YYYY-MM-DD from data]",
  "date": "<YYYY-MM-DD from the data>",
  "title": "<Explanatory title for next match>",
  "sport": "<sport name>",
  "headline": "<Catchy headline for next match>",
  "hook": "<Engaging hook for next match>",
  "details": "<Detailed analysis of next match>",
  "stats": {
    "teamA": "<Team A name>",
    "teamB": "<Team B name>",
    "scoreA": "<Team A score>",
    "scoreB": "<Team B score>",
    "venue": "<Venue/Stadium name>",
    "competition": "<League/Competition name>",
    "attendance": "<Attendance if available>",
    "duration": "<Match duration if available>"
  },
  "keyMoments": ["<Key moment 1>", "<Key moment 2>", "<Key moment 3>", "<Key moment 4>", "<Key moment 5>"],
  "summary": "<Comprehensive summary of the match outcome and significance>"
}

... (continue for each match)

- Create a separate JSON object for each match in the sports data
- Generate matchId in format: [TeamA vs TeamB]_[YYYY-MM-DD from data] (use actual team names from data)
- Make the content friendly, well-written, and engaging
- Each JSON object must be valid JSON
- Include all matches from the provided data
- Provide comprehensive details for each match
- Ensure each match has enough data for a complete article
- Use actual data from the sports API response

Context: Here is yesterday's sports data:
${JSON.stringify(sportsData, null, 2)}`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error('Error generating newsletter content:', error);
    throw error;
  }
};

const generateSportSpecificContent = async (sport, sportData) => {
  const prompt = `You are an AI content writer. Generate separate JSON objects for each match in the ${sport} data. Return multiple JSON objects in one output.

Only return the JSON objects — no introductions, explanations, or additional text. Do not wrap it in code blocks or say anything like "Here's your article". Just output clean, raw JSON objects separated by newlines.

For each match, create a JSON object with this exact structure:

{
  "matchId": "[TeamA vs TeamB]_[YYYY-MM-DD from data]",
  "date": "<YYYY-MM-DD from the data>",
  "title": "<Explanatory title explaining whose match and for what>",
  "sport": "${sport}",
  "headline": "<Catchy headline for the match>",
  "hook": "<Engaging hook to draw readers in>",
  "details": "<Detailed analysis of the match with comprehensive information>",
  "stats": {
    "teamA": "<Team A name>",
    "teamB": "<Team B name>",
    "scoreA": "<Team A score>",
    "scoreB": "<Team B score>",
    "venue": "<Venue/Stadium name>",
    "competition": "<League/Competition name>",
    "attendance": "<Attendance if available>",
    "duration": "<Match duration if available>"
  },
  "keyMoments": ["<Key moment 1>", "<Key moment 2>", "<Key moment 3>", "<Key moment 4>", "<Key moment 5>"],
  "summary": "<Comprehensive summary of the match outcome and significance>"
}

{
  "matchId": "[TeamA vs TeamB]_[YYYY-MM-DD from data]",
  "date": "<YYYY-MM-DD from the data>",
  "title": "<Explanatory title for next match>",
  "sport": "${sport}",
  "headline": "<Catchy headline for next match>",
  "hook": "<Engaging hook for next match>",
  "details": "<Detailed analysis of next match>",
  "stats": {
    "teamA": "<Team A name>",
    "teamB": "<Team B name>",
    "scoreA": "<Team A score>",
    "scoreB": "<Team B score>",
    "venue": "<Venue/Stadium name>",
    "competition": "<League/Competition name>",
    "attendance": "<Attendance if available>",
    "duration": "<Match duration if available>"
  },
  "keyMoments": ["<Key moment 1>", "<Key moment 2>", "<Key moment 3>", "<Key moment 4>", "<Key moment 5>"],
  "summary": "<Comprehensive summary of the match outcome and significance>"
}

... (continue for each match)

- Create a separate JSON object for each match in the ${sport} data
- Generate matchId in format: [TeamA vs TeamB]_[YYYY-MM-DD from data] (use actual team names from data)
- Make the content friendly, well-written, and engaging
- Each JSON object must be valid JSON
- Focus specifically on ${sport} content
- Include all matches from the provided data
- Provide comprehensive details for each match
- Ensure each match has enough data for a complete article
- Use actual data from the sports API response

Context: Here is yesterday's ${sport} data:
${JSON.stringify(sportData, null, 2)}`;

  try {
    return await callGeminiAPI(prompt);
  } catch (error) {
    console.error(`Error generating ${sport} content:`, error);
    throw error;
  }
};

module.exports = {
  generateNewsletterContent,
  generateSportSpecificContent
}; 