const express = require('express');
const router = express.Router();
const { fetchAFLData } = require('../services/sportsService');

// Get AFL games for a specific date
router.get('/games', async (req, res) => {
    try {
        const { date } = req.query;
        const data = await fetchAFLData(date);
        res.json(data);
    } catch (error) {
        console.error('Error fetching AFL data:', error);
        res.status(500).json({ error: 'Failed to fetch AFL data' });
    }
});

module.exports = router; 