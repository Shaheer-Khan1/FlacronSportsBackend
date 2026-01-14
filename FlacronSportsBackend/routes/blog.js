const express = require('express');
const router = express.Router();
const { generateBlogContent } = require('../services/geminiService');
const { formatBlogPost } = require('../utils/formatter');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    // TODO: Implement database integration
    res.json({ message: 'Get all blog posts' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate blog post using Gemini
router.post('/generate', async (req, res) => {
  try {
    const { topic, keywords } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const generatedContent = await generateBlogContent(topic, keywords);
    const formattedContent = formatBlogPost(generatedContent);
    
    res.json(formattedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    // TODO: Implement database integration
    res.status(201).json({ message: 'Blog post created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement database integration
    res.json({ message: `Get blog post ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    // TODO: Implement database integration
    res.json({ message: `Update blog post ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement database integration
    res.json({ message: `Delete blog post ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 