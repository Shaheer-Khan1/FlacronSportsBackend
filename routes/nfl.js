const express = require('express');
const router = express.Router();
const { fetchNFLData } = require('../services/sportsService');

// Get NFL games for a specific date
router.get('/games', async (req, res) => {
    try {
        const { date } = req.query;
        const data = await fetchNFLData(date);
        res.json(data);
    } catch (error) {
        console.error('Error fetching NFL data:', error);
        res.status(500).json({ error: 'Failed to fetch NFL data' });
    }
});

module.exports = router; 