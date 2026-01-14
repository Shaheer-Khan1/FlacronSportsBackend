const express = require('express');
const router = express.Router();
const { getGamesByDate } = require('../services/baseballService');

router.get('/games', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    const games = await getGamesByDate(date);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 