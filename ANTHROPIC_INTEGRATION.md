# Anthropic Claude Integration Guide

## Overview
The GenAI CRM Dashboard now includes full integration with Anthropic's Claude 3.5 Sonnet AI. The AI can reference your configured knowledge repositories (Confluence, GitHub, databases, uploaded files) to provide contextual customer support responses.

## Setup Instructions

### 1. Get Your Anthropic API Key
1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key

### 2. Environment Configuration
Create a `.env` file in your project root with:

```bash
# Required: Your Anthropic API key
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here

# Optional: Confluence integration
REACT_APP_CONFLUENCE_BASE_URL=https://yourcompany.atlassian.net/wiki
REACT_APP_CONFLUENCE_USERNAME=your.email@company.com
REACT_APP_CONFLUENCE_API_TOKEN=your_confluence_api_token
REACT_APP_CONFLUENCE_CS_SPACE_KEY=CS
```

### 3. Development Testing
With the API key configured:
1. Restart your development server: `npm run dev`
2. Go to the AI Assistant page
3. You should see "Anthropic Connected" status
4. Add repositories in Settings
5. Select repositories in AI Assistant
6. Submit queries to get real Claude responses

## Important: Production Deployment

### CORS Security Notice
⚠️ **The current implementation makes direct API calls to Anthropic from the browser, which will be blocked by CORS in production.**

### Recommended Production Architecture
For production deployment, you should:

1. **Create a Backend API** that handles Anthropic requests:
   ```javascript
   // Example Express.js endpoint
   app.post('/api/ai/query', async (req, res) => {
     const response = await fetch('https://api.anthropic.com/v1/messages', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-api-key': process.env.ANTHROPIC_API_KEY,
         'anthropic-version': '2023-06-01'
       },
       body: JSON.stringify(req.body)
     });
     res.json(await response.json());
   });
   ```

2. **Update Frontend Service** to call your backend:
   ```javascript
   // In src/services/anthropic.ts
   const response = await fetch('/api/ai/query', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(requestData)
   });
   ```

3. **Environment Variables** on your backend:
   ```bash
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Features

### 🎯 Repository Integration
- **Database Connections**: Query structure and data context
- **File Uploads**: Reference uploaded SOPs and documentation
- **Confluence**: Access knowledge base articles and procedures
- **GitHub/GitLab**: Reference documentation and README files

### 🧠 AI Capabilities
- **Contextual Responses**: AI references selected repositories
- **Step-by-Step Guidance**: Provides actionable process steps
- **SOP Compliance**: Ensures responses follow company procedures
- **Confidence Scoring**: Shows AI confidence in responses
- **Escalation Logic**: Identifies when human intervention is needed

### 📊 Analytics
- **Repository Usage**: Track which knowledge sources are most helpful
- **Response Quality**: Monitor AI response accuracy
- **Processing Time**: Measure query response times

## Usage

1. **Configure Repositories** (Settings page):
   - Add your knowledge sources
   - Test connections
   - Verify access permissions

2. **AI Assistant Workflow**:
   - Select relevant repositories for your query
   - Enter customer details and issue description
   - Submit for AI processing
   - Review generated response and process steps
   - Provide feedback on response quality

## API Limits & Costs

- **Rate Limits**: Anthropic API has rate limits per minute/hour
- **Token Costs**: Charges based on input/output tokens
- **Monitoring**: Track usage in Anthropic console

## Troubleshooting

### "API Key Missing"
- Ensure `.env` file is in project root
- Verify `REACT_APP_ANTHROPIC_API_KEY` is set
- Restart development server

### "API Key Invalid" 
- Check API key in Anthropic console
- Verify key hasn't expired
- Ensure sufficient credits/quota

### "Connection Failed"
- Check internet connectivity
- Verify Anthropic service status
- Review browser console for errors

### CORS Errors (Production)
- Implement backend proxy as described above
- Never expose API keys in frontend code
- Use server-side environment variables

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use backend proxies** for production
3. **Implement rate limiting** to prevent abuse
4. **Monitor API usage** for unexpected charges
5. **Validate all inputs** before sending to AI
6. **Sanitize AI outputs** before displaying to users

## Development vs Production

| Environment | API Key Location | CORS | Security |
|-------------|------------------|------|----------|
| Development | Frontend (.env) | Disabled | ⚠️ For testing only |
| Production | Backend (server) | Enabled | ✅ Secure |

The current implementation is perfect for development and testing. For production, follow the backend proxy pattern described above.