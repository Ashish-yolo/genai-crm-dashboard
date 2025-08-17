# GenAI CRM Backend API

Express.js backend server that provides secure proxy access to the Anthropic Claude API.

## 🚀 Quick Start

### Development
```bash
cd server
npm install
npm run dev
```

### Production
```bash
cd server
npm install
npm start
```

## 📝 Environment Variables

Create `.env` file:
```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## 🛣 API Endpoints

### Health Check
- **GET** `/health`
- Returns server status and version

### AI Query Processing
- **POST** `/api/ai/query`
- Proxies requests to Anthropic Claude API
- Handles authentication and rate limiting

### Connection Test
- **GET** `/api/ai/test`
- Tests Anthropic API connectivity
- Returns success/failure status

## 🔒 Security Features

- CORS protection
- Helmet security headers
- Request validation
- Rate limiting (ready for implementation)
- Environment-based configuration

## 🚀 Deployment

Deploy to Render, Railway, or any Node.js hosting service.

See `../DEPLOYMENT_GUIDE.md` for detailed instructions.