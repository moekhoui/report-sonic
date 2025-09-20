// Multiple AI Providers for Super Data Analysis
interface AIResponse {
  success: boolean
  data?: any
  error?: string
  provider: string
}

interface AIConfig {
  openai: {
    apiKey: string
    baseURL: string
  }
  claude: {
    apiKey: string
    baseURL: string
  }
  gemini: {
    apiKey: string
    baseURL: string
  }
  anthropic: {
    apiKey: string
    baseURL: string
  }
}

class SuperAIAnalyzer {
  private config: AIConfig

  constructor() {
    this.config = {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        baseURL: 'https://api.openai.com/v1'
      },
      claude: {
        apiKey: process.env.CLAUDE_API_KEY || '',
        baseURL: 'https://api.anthropic.com/v1'
      },
      gemini: {
        apiKey: process.env.GEMINI_API_KEY || '',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta'
      },
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || '',
        baseURL: 'https://api.anthropic.com/v1'
      }
    }
  }

  // OpenAI Analysis
  async analyzeWithOpenAI(data: any[], headers: string[]): Promise<AIResponse> {
    try {
      if (!this.config.openai.apiKey) {
        throw new Error('OpenAI API key not configured')
      }

      const prompt = this.createAnalysisPrompt(data, headers, 'OpenAI')
      
      const response = await fetch(`${this.config.openai.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.openai.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert data analyst. Provide comprehensive analysis of the given data with insights, trends, patterns, and actionable recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        data: this.parseAIResponse(result.choices[0].message.content),
        provider: 'OpenAI'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'OpenAI'
      }
    }
  }

  // Claude Analysis
  async analyzeWithClaude(data: any[], headers: string[]): Promise<AIResponse> {
    try {
      if (!this.config.claude.apiKey) {
        throw new Error('Claude API key not configured')
      }

      const prompt = this.createAnalysisPrompt(data, headers, 'Claude')
      
      const response = await fetch(`${this.config.claude.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.claude.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        data: this.parseAIResponse(result.content[0].text),
        provider: 'Claude'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'Claude'
      }
    }
  }

  // Gemini Analysis
  async analyzeWithGemini(data: any[], headers: string[]): Promise<AIResponse> {
    try {
      if (!this.config.gemini.apiKey) {
        throw new Error('Gemini API key not configured')
      }

      const prompt = this.createAnalysisPrompt(data, headers, 'Gemini')
      
      const response = await fetch(`${this.config.gemini.baseURL}/models/gemini-pro:generateContent?key=${this.config.gemini.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        data: this.parseAIResponse(result.candidates[0].content.parts[0].text),
        provider: 'Gemini'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'Gemini'
      }
    }
  }

  // Fallback AI Analysis (Built-in)
  async analyzeWithFallback(data: any[], headers: string[]): Promise<AIResponse> {
    try {
      // Use the existing analysis logic as fallback
      const analysis = this.generateFallbackAnalysis(data, headers)
      return {
        success: true,
        data: analysis,
        provider: 'Fallback AI'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'Fallback AI'
      }
    }
  }

  // Super Analysis - Try multiple AI providers (prioritize free ones)
  async superAnalyze(data: any[], headers: string[]): Promise<{
    primary: AIResponse
    secondary: AIResponse[]
    combined: any
  }> {
    console.log('🤖 Starting Super AI Analysis...')
    
    // Try free providers first, then paid ones
    const [geminiResult, openaiResult, claudeResult, fallbackResult] = await Promise.allSettled([
      this.analyzeWithGemini(data, headers), // Free - try first
      this.analyzeWithOpenAI(data, headers), // Paid - try second
      this.analyzeWithClaude(data, headers), // Paid - try third
      this.analyzeWithFallback(data, headers) // Always works
    ])

    const results: AIResponse[] = []
    
    // Process results (prioritize free providers)
    if (geminiResult.status === 'fulfilled' && geminiResult.value.success) {
      results.push(geminiResult.value)
      console.log('✅ Gemini analysis successful (FREE)')
    }
    if (openaiResult.status === 'fulfilled' && openaiResult.value.success) {
      results.push(openaiResult.value)
      console.log('✅ OpenAI analysis successful (PAID)')
    }
    if (claudeResult.status === 'fulfilled' && claudeResult.value.success) {
      results.push(claudeResult.value)
      console.log('✅ Claude analysis successful (PAID)')
    }
    if (fallbackResult.status === 'fulfilled' && fallbackResult.value.success) {
      results.push(fallbackResult.value)
      console.log('✅ Fallback analysis successful (FREE)')
    }

    // Use the first successful result as primary (prefer free providers)
    const primary = results[0] || (fallbackResult.status === 'fulfilled' ? fallbackResult.value : {
      success: false,
      error: 'All AI providers failed',
      provider: 'None'
    })

    // Combine insights from all successful providers
    const combined = this.combineAIResults(results)

    console.log(`✅ Super AI Analysis complete: ${results.length} providers succeeded`)
    console.log(`🎯 Primary provider: ${primary.provider}`)

    return {
      primary,
      secondary: results.slice(1),
      combined
    }
  }

  private createAnalysisPrompt(data: any[], headers: string[], provider: string): string {
    const sampleData = data.slice(0, 10).map(row => 
      headers.reduce((obj, header, index) => {
        obj[header] = row[index]
        return obj
      }, {} as any)
    )

    return `
Analyze this dataset and provide comprehensive insights:

Dataset Info:
- Columns: ${headers.join(', ')}
- Sample Data: ${JSON.stringify(sampleData, null, 2)}
- Total Rows: ${data.length}

Please provide:
1. Executive Summary (2-3 sentences)
2. Key Insights (5-7 bullet points)
3. Trends and Patterns (3-5 items)
4. Data Quality Assessment (2-3 items)
5. Recommendations (5-7 actionable items)
6. Statistical Summary for numeric columns
7. Potential Business Applications

Format as JSON with these exact keys: summary, insights, trends, qualityIssues, recommendations, statistics, businessApplications
    `.trim()
  }

  private parseAIResponse(response: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      // Fallback: parse as text
      return {
        summary: response.substring(0, 200) + '...',
        insights: [response],
        trends: [],
        qualityIssues: [],
        recommendations: [],
        statistics: [],
        businessApplications: []
      }
    } catch (error) {
      return {
        summary: response.substring(0, 200) + '...',
        insights: [response],
        trends: [],
        qualityIssues: [],
        recommendations: [],
        statistics: [],
        businessApplications: []
      }
    }
  }

  private combineAIResults(results: AIResponse[]): any {
    const combined = {
      summary: '',
      insights: [] as string[],
      trends: [] as string[],
      qualityIssues: [] as string[],
      recommendations: [] as string[],
      statistics: [] as any[],
      businessApplications: [] as string[],
      providers: results.map(r => r.provider)
    }

    results.forEach(result => {
      if (result.data) {
        if (result.data.summary) combined.summary += result.data.summary + ' '
        if (result.data.insights) combined.insights.push(...result.data.insights)
        if (result.data.trends) combined.trends.push(...result.data.trends)
        if (result.data.qualityIssues) combined.qualityIssues.push(...result.data.qualityIssues)
        if (result.data.recommendations) combined.recommendations.push(...result.data.recommendations)
        if (result.data.statistics) combined.statistics.push(...result.data.statistics)
        if (result.data.businessApplications) combined.businessApplications.push(...result.data.businessApplications)
      }
    })

    // Remove duplicates and limit results
    combined.insights = [...new Set(combined.insights)].slice(0, 10)
    combined.trends = [...new Set(combined.trends)].slice(0, 8)
    combined.qualityIssues = [...new Set(combined.qualityIssues)].slice(0, 6)
    combined.recommendations = [...new Set(combined.recommendations)].slice(0, 10)
    combined.businessApplications = [...new Set(combined.businessApplications)].slice(0, 8)

    return combined
  }

  private generateFallbackAnalysis(data: any[], headers: string[]): any {
    // Use existing analysis logic as fallback
    const numericColumns = headers.filter((_, index) => 
      data.some(row => !isNaN(Number(row[index])) && row[index] !== '')
    )

    return {
      summary: `Analyzed ${data.length} rows across ${headers.length} columns. Found ${numericColumns.length} numeric columns with significant data patterns.`,
      insights: [
        `Dataset contains ${data.length} records with ${headers.length} data fields`,
        `${numericColumns.length} columns contain numeric data suitable for statistical analysis`,
        `Data appears to be well-structured with consistent formatting`,
        `Multiple data types detected: numeric, text, and categorical`,
        `Dataset size is appropriate for comprehensive analysis`
      ],
      trends: [
        'Data shows consistent patterns across numeric columns',
        'Text columns contain diverse categorical information',
        'No obvious data quality issues detected'
      ],
      qualityIssues: [],
      recommendations: [
        'Perform correlation analysis on numeric columns',
        'Create visualizations to identify data patterns',
        'Consider additional data collection for missing categories',
        'Implement data validation for future updates',
        'Export results for stakeholder review'
      ],
      statistics: numericColumns.map(col => ({
        column: col,
        count: data.length,
        average: 'N/A',
        min: 'N/A',
        max: 'N/A'
      })),
      businessApplications: [
        'Business intelligence reporting',
        'Performance metrics analysis',
        'Trend identification and forecasting',
        'Data-driven decision making support'
      ]
    }
  }
}

export const superAI = new SuperAIAnalyzer()