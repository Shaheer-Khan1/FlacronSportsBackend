const express = require('express');
const router = express.Router();
const { fetchFormula1Data } = require('../services/sportsService');

// Get Formula 1 races for a specific date
router.get('/races', async (req, res) => {
    try {
        const { date } = req.query;
        const data = await fetchFormula1Data(date);
        res.json(data);
    } catch (error) {
        console.error('Error fetching Formula 1 data:', error);
        res.status(500).json({ error: 'Failed to fetch Formula 1 data' });
    }
});

module.exports = router; 