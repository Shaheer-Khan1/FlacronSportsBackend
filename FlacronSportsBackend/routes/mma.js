const express = require('express');
const router = express.Router();
const { fetchMMAData } = require('../services/sportsService');

// Get MMA fights for a specific date
router.get('/fights', async (req, res) => {
    try {
        const { date } = req.query;
        const data = await fetchMMAData(date);
        res.json(data);
    } catch (error) {
        console.error('Error fetching MMA data:', error);
        res.status(500).json({ error: 'Failed to fetch MMA data' });
    }
});

module.exports = router; 