const express = require('express');
const router = express.Router();
const { getYesterdayMatches } = require('../services/footballService');

router.get('/yesterday', async (req, res) => {
  try {
    const matches = await getYesterdayMatches();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 