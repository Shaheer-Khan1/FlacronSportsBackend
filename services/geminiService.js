const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyDBdT0W7yMIENvZO3QaoeyasfAfU3zC4RA'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateBlogContent(topic, keywords = []) {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = `Write a blog post about ${topic}${keywords.length ? ` focusing on ${keywords.join(', ')}` : ''}. 
    The blog post should be well-structured, engaging, and informative. 
    Include an introduction, main points, and a conclusion.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating blog content:', error);
    throw new Error('Failed to generate blog content');
  }
}

module.exports = {
  generateBlogContent
}; 