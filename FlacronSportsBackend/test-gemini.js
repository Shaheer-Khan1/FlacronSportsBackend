const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyDBdT0W7yMIENvZO3QaoeyasfAfU3zC4RA'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function testGeminiAPI() {
  console.log('Testing Gemini API connection...');
  console.log('API Key:', GEMINI_API_KEY);
  console.log('API URL:', GEMINI_API_URL);

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: "Write a one-sentence test response."
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\nAPI Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    
    if (response.data.candidates && response.data.candidates[0]?.content?.parts?.[0]?.text) {
      console.log('\nTest successful! API Response:');
      console.log(response.data.candidates[0].content.parts[0].text);
    } else {
      console.error('\nError: Unexpected response format');
      console.log('Full response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('\nError testing Gemini API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testGeminiAPI(); 