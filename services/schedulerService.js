const cron = require('node-cron');
const footballService = require('./footballService');
const baseballService = require('./baseballService');
const hockeyService = require('./hockeyService');
const rugbyService = require('./rugbyService');
const basketballService = require('./basketballService');
const { fetchVolleyballData, fetchAFLData, fetchFormula1Data, fetchMMAData, fetchNFLData } = require('./sportsService');
const { storeSportsData, getSportsData } = require('./firestoreService');
const { generateNewsletterContent, generateSportSpecificContent } = require('./geminiContentService');
const { sendNewsletter } = require('./emailService');

// Function to get yesterday's date in YYYY-MM-DD format
function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Function to fetch and store sports data in separate collections
async function fetchAndStoreSportsData() {
  const date = getYesterdayDate();
  console.log(`[${new Date().toISOString()}] Starting to fetch sports data for ${date}...`);

  try {
    // Fetch data for all sports in parallel
    console.log('Fetching data for all sports...');
    
    // Fetch data for sports with service files
    const [football, baseball, hockey, rugby, basketball] = await Promise.all([
      footballService.getGamesByDate(date).catch(err => ({ error: 'Football: ' + err.message })),
      baseballService.getGamesByDate(date).catch(err => ({ error: 'Baseball: ' + err.message })),
      hockeyService.getGamesByDate(date).catch(err => ({ error: 'Hockey: ' + err.message })),
      rugbyService.getGamesByDate(date).catch(err => ({ error: 'Rugby: ' + err.message })),
      basketballService.getGamesByDate(date).catch(err => ({ error: 'Basketball: ' + err.message }))
    ]);

    // Fetch data for new sports
    const [volleyball, afl, formula1, mma, nfl] = await Promise.all([
      fetchVolleyballData(date).catch(err => ({ error: 'Volleyball: ' + err.message })),
      fetchAFLData(date).catch(err => ({ error: 'AFL: ' + err.message })),
      fetchFormula1Data(date).catch(err => ({ error: 'Formula 1: ' + err.message })),
      fetchMMAData(date).catch(err => ({ error: 'MMA: ' + err.message })),
      fetchNFLData(date).catch(err => ({ error: 'NFL: ' + err.message }))
    ]);

    // Store each sport's data in its own collection
    const sportsData = {
      football: { date, data: football },
      baseball: { date, data: baseball },
      hockey: { date, data: hockey },
      rugby: { date, data: rugby },
      basketball: { date, data: basketball },
      volleyball: { date, data: volleyball },
      afl: { date, data: afl },
      formula1: { date, data: formula1 },
      mma: { date, data: mma },
      nfl: { date, data: nfl }
    };

    // Store data in separate collections
    for (const [sport, data] of Object.entries(sportsData)) {
      if (!data.data.error) {
        await storeSportsData(`${date}_highlights`, data, sport); // Store in sport-specific collection
        console.log(`${sport} data stored in ${sport} collection`);
      } else {
        console.error(`Error fetching ${sport} data:`, data.data.error);
      }
    }

    return sportsData;
  } catch (error) {
    console.error('Error in fetchAndStoreSportsData:', error);
    throw error;
  }
}

// Function to generate and store content
async function generateAndStoreContent() {
  const date = getYesterdayDate();
  console.log(`\n[${new Date().toISOString()}] Generating content from stored data for ${date}...`);

  try {
    // Get stored data from each sport's collection
    const sports = ['football', 'baseball', 'hockey', 'rugby', 'basketball', 'volleyball', 'afl', 'formula1', 'mma', 'nfl'];
    const sportsData = {};

    for (const sport of sports) {
      const data = await getSportsData(`${date}_highlights`, sport);
      if (data) {
        sportsData[sport] = data.data;
      }
    }

    if (Object.keys(sportsData).length === 0) {
      console.log('No data found in collections for', date);
      return;
    }

    // Generate and store newsletter content
    console.log('Generating newsletter content...');
    const newsletterContent = await generateNewsletterContent(sportsData);
    console.log('\nNewsletter Content:', newsletterContent);
    
    // Store newsletter in newsletters collection
    await storeSportsData(`${date}_newsletter`, {
      type: 'newsletter',
      date: date,
      content: newsletterContent,
      sourceData: sportsData
    }, 'newsletters');
    console.log('Newsletter content stored in newsletters collection');

    // Generate and store sport-specific content with 15-second delay between each
    for (const sport of sports) {
      if (sportsData[sport] && !sportsData[sport].error) {
        console.log(`\nGenerating ${sport} content...`);
        const sportContent = await generateSportSpecificContent(sport, sportsData[sport]);
        console.log(`\n${sport} Content:`, sportContent);
        
        // Store each JSON separately with matchId as document name
        try {
          // Clean the response (remove markdown formatting if present)
          let cleanedContent = sportContent;
          if (cleanedContent.includes('```json')) {
            cleanedContent = cleanedContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
          } else if (cleanedContent.includes('```')) {
            cleanedContent = cleanedContent.replace(/```\s*/, '').replace(/```\s*$/, '');
          }
          
          // Try to parse as a single JSON object first
          try {
            const singleJson = JSON.parse(cleanedContent);
            // If it's a single object with matches array, extract each match
            if (singleJson.matches && Array.isArray(singleJson.matches)) {
              for (const match of singleJson.matches) {
                const matchId = match.matchId || `[${match.stats?.teamA || 'TeamA'} vs ${match.stats?.teamB || 'TeamB'}_${match.date}]`;
                
                await storeSportsData(matchId, {
                  type: 'match',
                  sport: sport,
                  date: date,
                  matchData: match
                }, 'articles');
                
                console.log(`Match stored as ${matchId} in articles collection`);
              }
            } else {
              // Single match object
              const matchId = singleJson.matchId || `[${singleJson.stats?.teamA || 'TeamA'} vs ${singleJson.stats?.teamB || 'TeamB'}_${singleJson.date}]`;
              
              await storeSportsData(matchId, {
                type: 'match',
                sport: sport,
                date: date,
                matchData: singleJson
              }, 'articles');
              
              console.log(`Match stored as ${matchId} in articles collection`);
            }
          } catch (singleParseError) {
            // If single JSON parsing fails, try to find multiple JSON objects
            console.log('Single JSON parsing failed, trying to find multiple JSON objects...');
            
            // Look for JSON objects using regex pattern matching
            const jsonPattern = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
            const jsonMatches = cleanedContent.match(jsonPattern);
            
            if (jsonMatches) {
              for (const jsonString of jsonMatches) {
                try {
                  const matchData = JSON.parse(jsonString);
                  const matchId = matchData.matchId || `[${matchData.stats?.teamA || 'TeamA'} vs ${matchData.stats?.teamB || 'TeamB'}_${matchData.date}]`;
                  
                  await storeSportsData(matchId, {
                    type: 'match',
                    sport: sport,
                    date: date,
                    matchData: matchData
                  }, 'articles');
                  
                  console.log(`Match stored as ${matchId} in articles collection`);
                } catch (parseError) {
                  console.error('Error parsing individual JSON:', parseError);
                  console.log('Problematic JSON string:', jsonString);
                }
              }
            } else {
              // Fallback: try splitting by newlines and reconstructing JSON
              console.log('Trying fallback parsing method...');
              const lines = cleanedContent.trim().split('\n').filter(line => line.trim() !== '');
              let currentJson = '';
              let braceCount = 0;
              const jsonObjects = [];
              
              for (const line of lines) {
                currentJson += line + '\n';
                braceCount += (line.match(/\{/g) || []).length;
                braceCount -= (line.match(/\}/g) || []).length;
                
                if (braceCount === 0 && currentJson.trim()) {
                  try {
                    const parsed = JSON.parse(currentJson.trim());
                    jsonObjects.push(parsed);
                  } catch (e) {
                    console.log('Failed to parse reconstructed JSON:', currentJson.trim());
                  }
                  currentJson = '';
                }
              }
              
              // Store each reconstructed JSON object
              for (const matchData of jsonObjects) {
                const matchId = matchData.matchId || `[${matchData.stats?.teamA || 'TeamA'} vs ${matchData.stats?.teamB || 'TeamB'}_${matchData.date}]`;
                
                await storeSportsData(matchId, {
                  type: 'match',
                  sport: sport,
                  date: date,
                  matchData: matchData
                }, 'articles');
                
                console.log(`Match stored as ${matchId} in articles collection`);
              }
            }
          }
          
        } catch (parseError) {
          console.error(`Error processing ${sport} content:`, parseError);
          console.log('Raw content:', sportContent);
          
          // Store the raw content even if processing fails
          await storeSportsData(`${sport}_${date}`, {
            type: 'article',
            sport: sport,
            date: date,
            content: sportContent,
            parseError: parseError.message,
            sourceData: sportsData[sport]
          }, 'articles');
        }
        
        // Wait for 15 seconds before generating next sport's content
        if (sport !== sports[sports.length - 1]) {
          console.log('Waiting for 15 seconds before generating next content...');
          await new Promise(resolve => setTimeout(resolve, 15000));
        }
      }
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

// Test function to run the process with 15-second intervals
async function testScheduler() {
  console.log('Starting test scheduler...');
  try {
    // Fetch and store sports data
    console.log('Fetching and storing sports data...');
    await fetchAndStoreSportsData();
    
    // Wait 15 seconds before generating content
    console.log('Waiting 15 seconds before generating content...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Generate and store content
    console.log('Generating and storing content...');
    await generateAndStoreContent();
    
    console.log('Test scheduler completed successfully');
  } catch (error) {
    console.error('Test scheduler failed:', error);
  }
}

// Schedule the tasks
function startScheduler() {
  // Schedule data fetching at 05:00 AM UTC
  cron.schedule('0 5 * * *', async () => {
    console.log(`\n[${new Date().toISOString()}] Running scheduled sports data fetch...`);
    try {
      await fetchAndStoreSportsData();
    } catch (error) {
      console.error('Scheduled task failed:', error);
    }
  });

  // Schedule content generation at 05:30 AM UTC
  cron.schedule('30 5 * * *', async () => {
    console.log(`\n[${new Date().toISOString()}] Starting content generation...`);
    try {
      await generateAndStoreContent();
    } catch (error) {
      console.error('Content generation failed:', error);
    }
  });

  // Schedule newsletter sending at 6:00 AM UTC
  cron.schedule('0 6 * * *', async () => {
    console.log(`\n[${new Date().toISOString()}] Starting newsletter distribution...`);
    try {
      await sendNewsletter();
    } catch (error) {
      console.error('Newsletter distribution failed:', error);
    }
  });

  console.log('Sports data scheduler started:');
  console.log('- Data fetch scheduled for 05:00 AM UTC daily');
  console.log('- Content generation scheduled for 05:30 AM UTC daily');
  console.log('- Newsletter distribution scheduled for 6:00 AM UTC daily');
}

module.exports = {
  startScheduler,
  fetchAndStoreSportsData,
  generateAndStoreContent,
  testScheduler
}; 