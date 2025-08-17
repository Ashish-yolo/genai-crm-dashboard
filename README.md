# GenAI CRM Dashboard

A modern CRM dashboard powered by AI with integrated repository management for Confluence, GitHub, and other knowledge sources. This application provides intelligent customer support responses based on your company's SOPs and documentation.

## Key Features

- **AI-Powered Customer Support** - Intelligent responses based on your organization's SOPs and documentation
- **Repository Integration** - Connect to Confluence, GitHub, GitLab, and other knowledge sources
- **Real-time Data Sync** - Automatic synchronization with your knowledge repositories
- **Semantic Search** - Advanced search capabilities across all connected repositories
- **SOP Discovery & Indexing** - Automatically identify and index Standard Operating Procedures
- **Customer Management** - Comprehensive customer database and interaction tracking
- **Analytics & Reporting** - Advanced analytics with visualization charts
- **Modern UI** - Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Headless UI
- **State Management**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **API Client**: Custom service layer with Supabase client
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Deployment**: Netlify

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project
- GenAI CRM API backend running

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd genai-crm-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Supabase Configuration (Optional - for advanced features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration (Optional)
VITE_API_BASE_URL=your-api-endpoint

# Debug Mode (Optional)
VITE_DEBUG_MODE=false
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components
│   └── repository/     # Repository management components
├── contexts/           # React contexts
├── pages/              # Page components
├── services/           # API services and integrations
│   ├── confluence/     # Confluence API integration
│   ├── repository/     # Repository management
│   ├── ai/            # AI processing services
│   └── search/        # Search engine services
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx           # App entry point
```

## Repository Integration

The application supports connecting to various repository types to power the AI engine with your organization's knowledge:

### Confluence Integration
- **Base URL**: Your Confluence instance URL (e.g., `https://company.atlassian.net/wiki`)
- **Username**: Your Confluence username or email
- **API Token**: Generate from Confluence Account Settings > Security > API tokens
- **Space Key**: The space containing your SOPs and documentation

### GitHub Integration
- **Repository URL**: Full GitHub repository URL
- **Access Token**: Personal access token with `repo` permissions
- **Branch**: Target branch (default: main)
- **Path Filter**: Optional path to specific documentation folders

### GitLab Integration
- **Project URL**: GitLab project URL
- **Access Token**: Project or personal access token
- **Branch**: Target branch (default: main)

## AI-Powered Features

### SOP Discovery
- Automatically identifies Standard Operating Procedures
- Extracts and indexes documentation content
- Creates searchable knowledge base

### Intelligent Responses
- Context-aware customer support responses
- Draws from your organization's SOPs
- Semantic search across all connected repositories

### Real-time Sync
- Monitors repository changes
- Updates knowledge base automatically
- Maintains fresh, current information

## Getting Started

### Initial Setup

1. **Launch the Application**
   ```bash
   npm run dev
   ```

2. **Add Your First Repository**
   - Navigate to the Settings page
   - Click "Add Repository"
   - Choose your repository type (Confluence, GitHub, GitLab)
   - Enter your credentials and configuration
   - Test the connection

3. **Start Using AI Support**
   - Go to the AI Chat interface
   - Ask questions about customer support scenarios
   - The AI will respond based on your connected SOPs

### Security & Credentials

- All credentials are stored securely in encrypted browser storage
- No credentials are transmitted to external services
- Repository connections use HTTPS/SSL encryption
- You can remove or update credentials at any time

## Deployment

### Netlify Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
- Connect your repository to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`
- Add environment variables in Netlify dashboard

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist/` folder to your hosting provider

## Troubleshooting

### Common Issues

**Repository Connection Fails**
- Verify credentials are correct
- Check that the repository/space exists
- Ensure API tokens have proper permissions
- Test network connectivity to the service

**No SOPs Found**
- Check that your repository contains documentation
- Verify the space key or path filters are correct
- Ensure documents are publicly accessible or you have proper permissions

**Build or Deployment Issues**
- Ensure Node.js version is 18 or higher
- Delete `node_modules` and run `npm install` again
- Check for TypeScript errors with `npm run type-check`
- Verify all environment variables are set correctly

**Styling Not Loading**
- Clear browser cache and hard refresh
- Check browser console for CSS loading errors
- Verify Tailwind CSS is properly configured

## Development

### Adding New Repository Types

1. Create a new service class in `src/services/`
2. Implement the `RepositoryConnector` interface
3. Add the connector to `RepositoryManager`
4. Update the UI components to support the new type

### Customizing AI Responses

1. Modify the AI processing logic in `src/services/ai/`
2. Update search algorithms in `src/services/search/`
3. Customize SOP detection patterns
4. Configure response templates

### Extending Search Capabilities

1. Add new search providers in `src/services/search/`
2. Implement custom indexing strategies
3. Configure semantic search parameters
4. Add new content extraction methods

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.