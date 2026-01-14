function formatBlogPost(content) {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  // Extract title from first paragraph
  const title = paragraphs[0].replace(/^#\s*/, '').trim();
  
  // Format the content
  const formattedContent = {
    title,
    content: paragraphs.slice(1).join('\n\n'),
    metadata: {
      wordCount: content.split(/\s+/).length,
      readingTime: Math.ceil(content.split(/\s+/).length / 200), // Assuming 200 words per minute
      createdAt: new Date().toISOString()
    }
  };

  return formattedContent;
}

module.exports = {
  formatBlogPost
}; 