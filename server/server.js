const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security and middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Anthropic API proxy endpoint
app.post('/api/ai/query', async (req, res) => {
  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        error: 'Anthropic API key not configured on server' 
      });
    }

    // Validate request body
    const { model, max_tokens, temperature, system, messages } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request: messages array is required' 
      });
    }

    // Make request to Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: Math.min(max_tokens || 2000, 4000), // Cap max tokens
        temperature: temperature || 0.1,
        system: system || '',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      
      return res.status(response.status).json({
        error: `Anthropic API error: ${response.status}`,
        details: response.status === 401 ? 'Invalid API key' : 
                response.status === 429 ? 'Rate limit exceeded' :
                response.status === 500 ? 'Anthropic service error' : 'Unknown error'
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Server error in /api/ai/query:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Test Anthropic API connection
app.get('/api/ai/test', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ 
        success: false,
        error: 'Anthropic API key not configured' 
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.json({
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      });
    }

    res.json({ success: true });

  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Repository management endpoints (for future expansion)
app.get('/api/repositories', (req, res) => {
  // This could connect to a database in the future
  res.json({ message: 'Repository management endpoint - to be implemented' });
});

// Serve static files from the React app build (if in production)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  
  // The "catchall" handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
} else {
  // 404 handler for development
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
}

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 GenAI CRM Backend running on port ${PORT}`);
  console.log(`🔑 Anthropic API key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});