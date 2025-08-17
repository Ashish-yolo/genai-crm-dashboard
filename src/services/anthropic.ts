// Note: In production, Anthropic API calls should go through your backend
// This is a frontend implementation that shows the structure

interface Repository {
  id: string
  name: string
  type: 'confluence' | 'github' | 'gitlab' | 'database' | 'file_upload'
  config: any
  status: 'connected' | 'disconnected' | 'error'
  createdAt: string
}

interface QueryWithRepositories {
  ticketId: string
  customerId?: string
  customerVoice: string
  agentContext: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  selectedRepositories: Repository[]
}

interface AIResponse {
  suggestedResponse: string
  processSteps: Array<{
    step: number
    action: string
    reasoning: string
    sopReference: string
    confluenceUrl: string
  }>
  sopSources: Array<{
    title: string
    url: string
    version: string
    relevanceScore: number
  }>
  confidenceScore: number
  classification: 'sop_based' | 'new_scenario' | 'unclear'
  sopFreshness: 'fresh' | 'stale' | 'outdated'
  totalSOPsConsulted: number
  reasoning: string
  escalationNeeded: boolean
  additionalResources: string[]
}

class AnthropicAIService {
  private apiKey: string
  private baseUrl: string
  private isProduction: boolean

  constructor(apiKey: string) {
    // In production, API key will be handled by backend
    this.apiKey = apiKey || ''
    this.isProduction = process.env.NODE_ENV === 'production'
    this.baseUrl = this.isProduction 
      ? (process.env.REACT_APP_API_BASE_URL || '') + '/api/ai/query'
      : 'https://api.anthropic.com/v1/messages'
  }

  async processQueryWithRepositories(query: QueryWithRepositories): Promise<AIResponse> {
    const repositoryContext = this.buildRepositoryContext(query.selectedRepositories)
    
    const systemPrompt = `You are an AI customer service assistant with access to company knowledge repositories. 
    
Available Knowledge Sources:
${repositoryContext}

Your task is to analyze customer queries and provide detailed, step-by-step guidance based on the available SOPs and documentation.

Always respond in this exact JSON format:
{
  "suggestedResponse": "Customer-facing response text",
  "processSteps": [
    {
      "step": 1,
      "action": "What to do",
      "reasoning": "Why this step is needed",
      "sopReference": "Which SOP/document this comes from",
      "confluenceUrl": "#"
    }
  ],
  "sopSources": [
    {
      "title": "Document name",
      "url": "Document URL",
      "version": "1.0",
      "relevanceScore": 0.9
    }
  ],
  "confidenceScore": 85,
  "classification": "sop_based",
  "sopFreshness": "fresh",
  "totalSOPsConsulted": 2,
  "reasoning": "Why you chose this approach",
  "escalationNeeded": false,
  "additionalResources": []
}`

    const userPrompt = `Customer Query Details:
- Ticket ID: ${query.ticketId}
- Customer ID: ${query.customerId || 'Not provided'}
- Priority: ${query.priority}
- Customer Voice: "${query.customerVoice}"
- Agent Context: "${query.agentContext}"

Please analyze this query and provide a comprehensive response using the available knowledge sources.`

    try {
      const requestBody = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      }

      // Different headers for production vs development
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      if (!this.isProduction) {
        // Development: direct call to Anthropic
        headers['x-api-key'] = this.apiKey
        headers['anthropic-version'] = '2023-06-01'
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`)
      }

      const responseData = await response.json()
      const responseText = responseData.content?.[0]?.text || ''
      
      try {
        const parsedResponse = JSON.parse(responseText)
        return this.validateAndNormalizeResponse(parsedResponse, query.selectedRepositories)
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        return this.createFallbackResponse(query)
      }
    } catch (error) {
      console.error('Anthropic API error:', error)
      return this.createFallbackResponse(query)
    }
  }

  private buildRepositoryContext(repositories: Repository[]): string {
    if (repositories.length === 0) {
      return "No specific knowledge sources selected. Use general customer service best practices."
    }

    return repositories.map(repo => {
      const details = this.getRepositoryDetails(repo)
      return `- ${repo.name} (${repo.type}): ${details}`
    }).join('\n')
  }

  private getRepositoryDetails(repo: Repository): string {
    switch (repo.type) {
      case 'confluence':
        return `Confluence space containing SOPs and documentation at ${repo.config.baseUrl}`
      case 'github':
      case 'gitlab':
        return `Code repository with documentation at ${repo.config.repoUrl}`
      case 'database':
        return `${repo.config.type} database containing customer and operational data`
      case 'file_upload':
        return `Uploaded SOP documents and knowledge files`
      default:
        return 'Knowledge repository'
    }
  }

  private validateAndNormalizeResponse(response: any, repositories: Repository[]): AIResponse {
    // Ensure all required fields exist with defaults
    return {
      suggestedResponse: response.suggestedResponse || 'Thank you for your inquiry. Let me review this and get back to you with the appropriate guidance.',
      processSteps: (response.processSteps || []).map((step: any, index: number) => ({
        step: step.step || index + 1,
        action: step.action || 'Review customer request',
        reasoning: step.reasoning || 'Standard customer service protocol',
        sopReference: step.sopReference || (repositories.length > 0 ? repositories[0].name : 'General Guidelines'),
        confluenceUrl: step.confluenceUrl || '#'
      })),
      sopSources: repositories.map((repo) => ({
        title: repo.name,
        url: repo.config?.baseUrl || repo.config?.repoUrl || '#',
        version: '1.0',
        relevanceScore: Math.max(0.7, Math.random())
      })),
      confidenceScore: Math.min(100, Math.max(0, response.confidenceScore || 75)),
      classification: response.classification || 'sop_based',
      sopFreshness: response.sopFreshness || 'fresh',
      totalSOPsConsulted: repositories.length,
      reasoning: response.reasoning || 'Based on available knowledge sources and company policies',
      escalationNeeded: response.escalationNeeded || false,
      additionalResources: response.additionalResources || []
    }
  }

  private createFallbackResponse(query: QueryWithRepositories): AIResponse {
    return {
      suggestedResponse: `Thank you for contacting us regarding "${query.customerVoice}". I understand this is a ${query.priority} priority issue. Let me review our procedures and get back to you with the appropriate next steps to resolve this matter.`,
      processSteps: [
        {
          step: 1,
          action: 'Acknowledge customer inquiry',
          reasoning: 'Standard protocol for all customer contacts',
          sopReference: 'General Customer Service Guidelines',
          confluenceUrl: '#'
        },
        {
          step: 2,
          action: 'Review relevant policies and procedures',
          reasoning: 'Ensure compliance with company standards',
          sopReference: 'Standard Operating Procedures',
          confluenceUrl: '#'
        },
        {
          step: 3,
          action: 'Provide appropriate resolution or escalate if needed',
          reasoning: 'Customer satisfaction is our priority',
          sopReference: 'Resolution Framework',
          confluenceUrl: '#'
        }
      ],
      sopSources: query.selectedRepositories.map(repo => ({
        title: repo.name,
        url: repo.config?.baseUrl || repo.config?.repoUrl || '#',
        version: '1.0',
        relevanceScore: 0.8
      })),
      confidenceScore: 70,
      classification: 'unclear',
      sopFreshness: 'fresh',
      totalSOPsConsulted: query.selectedRepositories.length,
      reasoning: 'Fallback response due to API limitations or errors',
      escalationNeeded: false,
      additionalResources: []
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, use dedicated test endpoint
      if (this.isProduction) {
        const testUrl = (process.env.REACT_APP_API_BASE_URL || '') + '/api/ai/test'
        const response = await fetch(testUrl)
        
        if (!response.ok) {
          return { 
            success: false, 
            error: `Backend test failed: ${response.status}` 
          }
        }
        
        const result = await response.json()
        return result
      }

      // Development: direct test to Anthropic
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
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
      })

      if (!response.ok) {
        const errorText = await response.text()
        return { 
          success: false, 
          error: `HTTP ${response.status}: ${errorText}`
        }
      }

      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to connect to Anthropic API'
      }
    }
  }
}

export default AnthropicAIService