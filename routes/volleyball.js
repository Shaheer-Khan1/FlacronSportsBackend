const express = require('express');
const router = express.Router();
const { fetchVolleyballData } = require('../services/sportsService');

// Get volleyball games for a specific date
router.get('/games', async (req, res) => {
    try {
        const { date } = req.query;
        const data = await fetchVolleyballData(date);
        res.json(data);
    } catch (error) {
        console.error('Error fetching volleyball data:', error);
        res.status(500).json({ error: 'Failed to fetch volleyball data' });
    }
});

module.exports = router; 