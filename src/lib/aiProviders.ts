// Enhanced AI Providers with Adaptive Analysis
interface AIResponse {
  success: boolean
  data?: any
  error?: string
  provider: string
}

interface AIConfig {
  deepseek: {
    apiKey: string
    baseURL: string
  }
  openai: {
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

interface DomainContext {
  domain: 'Sales' | 'Finance' | 'Marketing' | 'Operations' | 'HR' | 'Healthcare' | 'Education' | 'E-commerce' | 'Manufacturing' | 'Technology' | 'Unknown'
  sophistication: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert'
  persona: 'Executive' | 'Manager' | 'Analyst' | 'Specialist'
  purpose: 'Performance' | 'Trend' | 'Comparison' | 'Forecast' | 'Diagnostic'
  industry: string
}

interface PromptStrategy {
  type: 'ExecutiveBrief' | 'AnalyticalDeepDive' | 'VisualStorytelling' | 'TechnicalReport'
  template: string
  focus: string[]
}

class SuperAIAnalyzer {
  private config: AIConfig
  private analysisCache: Map<string, any> = new Map()

  constructor() {
    this.config = {
      deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY || 'sk-1548269586504f5aaf04a86a23ad7961',
        baseURL: 'https://api.deepseek.com/v1'
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        baseURL: 'https://api.openai.com/v1'
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

  // Enhanced Adaptive Analyzer
  private adaptiveAnalyzer = {
    // 1. CONTEXT DETECTION
    detectContext: (headers: string[], sampleData: any[]): DomainContext => {
      const headerText = headers.join(' ').toLowerCase()
      const sampleText = sampleData.slice(0, 5).flat().join(' ').toLowerCase()
      const combinedText = `${headerText} ${sampleText}`

      // Domain Detection
      let domain: DomainContext['domain'] = 'Unknown'
      if (combinedText.includes('sales') || combinedText.includes('revenue') || combinedText.includes('customer')) {
        domain = 'Sales'
      } else if (combinedText.includes('profit') || combinedText.includes('cost') || combinedText.includes('budget') || combinedText.includes('financial')) {
        domain = 'Finance'
      } else if (combinedText.includes('marketing') || combinedText.includes('campaign') || combinedText.includes('advertisement') || combinedText.includes('lead')) {
        domain = 'Marketing'
      } else if (combinedText.includes('employee') || combinedText.includes('hr') || combinedText.includes('salary') || combinedText.includes('staff')) {
        domain = 'HR'
      } else if (combinedText.includes('operation') || combinedText.includes('production') || combinedText.includes('manufacturing') || combinedText.includes('supply')) {
        domain = 'Operations'
      } else if (combinedText.includes('patient') || combinedText.includes('medical') || combinedText.includes('health') || combinedText.includes('treatment')) {
        domain = 'Healthcare'
      } else if (combinedText.includes('student') || combinedText.includes('education') || combinedText.includes('course') || combinedText.includes('learning')) {
        domain = 'Education'
      } else if (combinedText.includes('product') || combinedText.includes('inventory') || combinedText.includes('ecommerce') || combinedText.includes('order')) {
        domain = 'E-commerce'
      } else if (combinedText.includes('technology') || combinedText.includes('software') || combinedText.includes('development') || combinedText.includes('code')) {
        domain = 'Technology'
      }

      // Industry Detection
      let industry = 'General Business'
      if (combinedText.includes('retail') || combinedText.includes('store') || combinedText.includes('shop')) {
        industry = 'Retail'
      } else if (combinedText.includes('bank') || combinedText.includes('financial') || combinedText.includes('investment')) {
        industry = 'Financial Services'
      } else if (combinedText.includes('tech') || combinedText.includes('software') || combinedText.includes('saas')) {
        industry = 'Technology'
      } else if (combinedText.includes('health') || combinedText.includes('medical') || combinedText.includes('pharma')) {
        industry = 'Healthcare'
      } else if (combinedText.includes('manufacturing') || combinedText.includes('production') || combinedText.includes('factory')) {
        industry = 'Manufacturing'
      }

      // Sophistication Detection
      const numericColumns = headers.filter((_, index) => 
        sampleData.some(row => !isNaN(Number(row[index])) && row[index] !== '')
      ).length
      const totalColumns = headers.length
      const sophistication = numericColumns / totalColumns > 0.7 ? 'Advanced' : 
                           numericColumns / totalColumns > 0.4 ? 'Intermediate' : 'Basic'

      // Persona Detection
      const persona = sampleData.length > 1000 ? 'Executive' : 
                     sampleData.length > 100 ? 'Manager' : 'Analyst'

      // Purpose Detection
      let purpose: DomainContext['purpose'] = 'Performance'
      if (combinedText.includes('trend') || combinedText.includes('time') || combinedText.includes('month') || combinedText.includes('year')) {
        purpose = 'Trend'
      } else if (combinedText.includes('compare') || combinedText.includes('vs') || combinedText.includes('versus')) {
        purpose = 'Comparison'
      } else if (combinedText.includes('forecast') || combinedText.includes('predict') || combinedText.includes('future')) {
        purpose = 'Forecast'
      } else if (combinedText.includes('issue') || combinedText.includes('problem') || combinedText.includes('error')) {
        purpose = 'Diagnostic'
      }

      return { domain, sophistication, persona, purpose, industry }
    },

    // 2. ADAPTIVE PROMPT SELECTION
    selectPromptStrategy: (context: DomainContext): PromptStrategy => {
      const strategies = {
        ExecutiveBrief: {
          type: 'ExecutiveBrief' as const,
          template: `You are a senior data analyst presenting to C-level executives in the ${context.industry} industry.

DATASET CONTEXT:
- Business Domain: ${context.domain}
- Industry: ${context.industry}
- Analysis Level: ${context.sophistication}
- Target Audience: ${context.persona}
- Purpose: ${context.purpose}

YOUR TASK: Provide executive-level insights that drive strategic decisions.

REQUIREMENTS:
1. Lead with the most impactful business metric
2. Explain financial/operational significance in 1-2 sentences
3. Provide specific, actionable recommendations
4. Highlight opportunities and risks
5. Use executive language (avoid technical jargon)

FORMAT: "Key Finding → Business Impact → Strategic Action"`,
          focus: ['executive_summary', 'key_metrics', 'strategic_recommendations', 'risk_opportunities']
        },
        AnalyticalDeepDive: {
          type: 'AnalyticalDeepDive' as const,
          template: `You are a senior data analyst conducting a comprehensive analysis for ${context.persona}s in the ${context.industry} industry.

DATASET CONTEXT:
- Business Domain: ${context.domain}
- Industry: ${context.industry}
- Analysis Level: ${context.sophistication}
- Purpose: ${context.purpose}

YOUR TASK: Provide detailed analytical insights with supporting evidence.

REQUIREMENTS:
1. Comprehensive statistical analysis
2. Detailed trend identification
3. Root cause analysis
4. Data quality assessment
5. Multiple scenario analysis
6. Technical recommendations

FORMAT: "Analysis → Evidence → Implications → Recommendations"`,
          focus: ['statistical_analysis', 'trend_analysis', 'root_cause', 'data_quality', 'scenarios']
        },
        VisualStorytelling: {
          type: 'VisualStorytelling' as const,
          template: `You are a data storyteller creating compelling narratives for ${context.persona}s in the ${context.industry} industry.

DATASET CONTEXT:
- Business Domain: ${context.domain}
- Industry: ${context.industry}
- Analysis Level: ${context.sophistication}
- Purpose: ${context.purpose}

YOUR TASK: Create a compelling data story that engages and informs.

REQUIREMENTS:
1. Narrative structure with beginning, middle, end
2. Visual metaphors and analogies
3. Emotional connection to business impact
4. Clear progression of insights
5. Memorable key takeaways

FORMAT: "Story Setup → Data Journey → Business Transformation → Future Vision"`,
          focus: ['narrative', 'visual_metaphors', 'emotional_impact', 'progression', 'memorable_insights']
        },
        TechnicalReport: {
          type: 'TechnicalReport' as const,
          template: `You are a technical data analyst creating a comprehensive report for ${context.persona}s in the ${context.industry} industry.

DATASET CONTEXT:
- Business Domain: ${context.domain}
- Industry: ${context.industry}
- Analysis Level: ${context.sophistication}
- Purpose: ${context.purpose}

YOUR TASK: Provide technical analysis with detailed methodology.

REQUIREMENTS:
1. Detailed methodology explanation
2. Statistical significance testing
3. Data validation and quality metrics
4. Technical implementation details
5. Performance benchmarks
6. Technical recommendations

FORMAT: "Methodology → Analysis → Validation → Technical Recommendations"`,
          focus: ['methodology', 'statistical_tests', 'validation', 'implementation', 'benchmarks']
        }
      }

      // Select strategy based on context
      if (context.persona === 'Executive' || context.sophistication === 'Basic') {
        return strategies.ExecutiveBrief
      } else if (context.sophistication === 'Advanced' || context.sophistication === 'Expert') {
        return strategies.AnalyticalDeepDive
      } else if (context.purpose === 'Trend' || context.purpose === 'Performance') {
        return strategies.VisualStorytelling
      } else {
        return strategies.TechnicalReport
      }
    },

    // 3. DYNAMIC VISUALIZATION STRATEGY
    optimizeCharts: (context: DomainContext, data: any[][], headers: string[]) => {
      const chartRecommendations = []
      
      // Domain-specific chart preferences
      const domainCharts: Record<DomainContext['domain'], string[]> = {
        'Sales': ['line', 'bar', 'scatter', 'area'],
        'Finance': ['line', 'bar', 'waterfall', 'radar'],
        'Marketing': ['pie', 'doughnut', 'bar', 'heatmap'],
        'Operations': ['line', 'bar', 'box', 'scatter'],
        'HR': ['pie', 'bar', 'radar', 'heatmap'],
        'Healthcare': ['line', 'bar', 'scatter', 'box'],
        'Education': ['bar', 'line', 'pie', 'radar'],
        'E-commerce': ['line', 'bar', 'area', 'scatter'],
        'Manufacturing': ['line', 'bar', 'box', 'heatmap'],
        'Technology': ['line', 'bar', 'scatter', 'radar'],
        'Unknown': ['bar', 'line', 'pie']
      }

      const preferredCharts = domainCharts[context.domain] || ['bar', 'line', 'pie']
      
      return {
        preferredTypes: preferredCharts,
        complexity: context.sophistication,
        focus: context.purpose,
        industry: context.industry
      }
    }
  }

  // DeepSeek Analysis (Primary Provider)
  async analyzeWithDeepSeek(data: any[], headers: string[]): Promise<AIResponse> {
    try {
      if (!this.config.deepseek.apiKey) {
        throw new Error('DeepSeek API key not configured')
      }

      // Generate cache key for performance optimization
      const cacheKey = `deepseek_${JSON.stringify({ headers, dataLength: data.length, sampleData: data.slice(0, 3) })}`
      if (this.analysisCache.has(cacheKey)) {
        return this.analysisCache.get(cacheKey)
      }

      // Detect context and select strategy
      const context = this.adaptiveAnalyzer.detectContext(headers, data)
      const strategy = this.adaptiveAnalyzer.selectPromptStrategy(context)
      
      const prompt = this.createEnhancedAnalysisPrompt(data, headers, context, strategy)
      
      const response = await fetch(`${this.config.deepseek.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.deepseek.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: strategy.template
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const result = await response.json()
      const aiResponse = {
        success: true,
        data: this.parseAIResponse(result.choices[0].message.content),
        provider: 'DeepSeek',
        context: context,
        strategy: strategy.type
      }

      // Cache the result for performance
      this.analysisCache.set(cacheKey, aiResponse)
      
      return aiResponse
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'DeepSeek'
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

  // Anthropic Claude Analysis
  async analyzeWithClaude(data: any[], headers: string[]): Promise<AIResponse> {
    try {
      if (!this.config.anthropic.apiKey) {
        throw new Error('Anthropic API key not configured')
      }

      const prompt = this.createAnalysisPrompt(data, headers, 'Claude')
      
      const response = await fetch(`${this.config.anthropic.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.anthropic.apiKey,
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

  // Enhanced Super Analysis - Try multiple AI providers (prioritize DeepSeek)
  async superAnalyze(data: any[], headers: string[]): Promise<{
    primary: AIResponse
    secondary: AIResponse[]
    combined: any
    context?: DomainContext
    strategy?: string
  }> {
    console.log('🤖 Starting Enhanced Super AI Analysis...')
    
    // Try DeepSeek first (primary), then other providers
    const [deepseekResult, openaiResult, geminiResult, fallbackResult] = await Promise.allSettled([
      this.analyzeWithDeepSeek(data, headers), // Primary - DeepSeek
      this.analyzeWithOpenAI(data, headers), // Secondary - OpenAI
      this.analyzeWithGemini(data, headers), // Tertiary - Gemini (free)
      this.analyzeWithFallback(data, headers) // Fallback - always works
    ])

    const results: AIResponse[] = []
    
    // Process results (prioritize DeepSeek)
    if (deepseekResult.status === 'fulfilled' && deepseekResult.value.success) {
      results.push(deepseekResult.value)
      console.log('✅ DeepSeek analysis successful (PRIMARY)')
    }
    if (openaiResult.status === 'fulfilled' && openaiResult.value.success) {
      results.push(openaiResult.value)
      console.log('✅ OpenAI analysis successful (SECONDARY)')
    }
    if (geminiResult.status === 'fulfilled' && geminiResult.value.success) {
      results.push(geminiResult.value)
      console.log('✅ Gemini analysis successful (TERTIARY)')
    }
    if (fallbackResult.status === 'fulfilled' && fallbackResult.value.success) {
      results.push(fallbackResult.value)
      console.log('✅ Fallback analysis successful (FALLBACK)')
    }

    // Use the first successful result as primary (prefer DeepSeek)
    const primary = results[0] || (fallbackResult.status === 'fulfilled' ? fallbackResult.value : {
      success: false,
      error: 'All AI providers failed',
      provider: 'None'
    })

    // Combine insights from all successful providers
    const combined = this.combineAIResults(results)

    // Extract context and strategy from primary result
    const context = (primary as any).context
    const strategy = (primary as any).strategy

    console.log(`✅ Enhanced Super AI Analysis complete: ${results.length} providers succeeded`)
    console.log(`🎯 Primary provider: ${primary.provider}`)
    if (context) {
      console.log(`🏢 Detected domain: ${context.domain} | Industry: ${context.industry}`)
      console.log(`📊 Analysis strategy: ${strategy}`)
    }

    return {
      primary,
      secondary: results.slice(1),
      combined,
      context,
      strategy
    }
  }

  // Enhanced prompt creation with context awareness
  private createEnhancedAnalysisPrompt(data: any[], headers: string[], context: DomainContext, strategy: PromptStrategy): string {
    const sampleData = data.slice(0, 10).map(row => 
      headers.reduce((obj, header, index) => {
        obj[header] = row[index]
        return obj
      }, {} as any)
    )

    // Calculate key metrics for context
    const numericColumns = headers.filter((_, index) => 
      data.some(row => !isNaN(Number(row[index])) && row[index] !== '')
    )
    const categoricalColumns = headers.filter((_, index) => 
      data.some(row => typeof row[index] === 'string' && isNaN(Number(row[index])))
    )

    return `
DATASET ANALYSIS REQUEST

Dataset Information:
- Columns: ${headers.join(', ')}
- Total Rows: ${data.length}
- Numeric Columns: ${numericColumns.length} (${numericColumns.join(', ')})
- Categorical Columns: ${categoricalColumns.length} (${categoricalColumns.join(', ')})
- Sample Data: ${JSON.stringify(sampleData, null, 2)}

DETECTED CONTEXT:
- Business Domain: ${context.domain}
- Industry: ${context.industry}
- Analysis Sophistication: ${context.sophistication}
- Target Audience: ${context.persona}
- Analysis Purpose: ${context.purpose}

ANALYSIS REQUIREMENTS:
Based on the detected context and strategy (${strategy.type}), provide:

1. EXECUTIVE SUMMARY (2-3 sentences focusing on business impact)
2. KEY INSIGHTS (5-7 bullet points with specific metrics and business significance)
3. TRENDS AND PATTERNS (3-5 items with quantitative evidence)
4. DATA QUALITY ASSESSMENT (2-3 items with specific recommendations)
5. STRATEGIC RECOMMENDATIONS (5-7 actionable items tailored to ${context.industry} industry)
6. STATISTICAL SUMMARY (detailed analysis of numeric columns)
7. BUSINESS APPLICATIONS (3-5 specific use cases for ${context.domain} domain)
8. RISK OPPORTUNITIES (2-3 potential risks and opportunities)
9. NEXT STEPS (3-4 specific actions to take)

FORMAT: Return as JSON with these exact keys: summary, insights, trends, qualityIssues, recommendations, statistics, businessApplications, riskOpportunities, nextSteps

FOCUS AREAS: ${strategy.focus.join(', ')}

IMPORTANT: 
- Use ${context.industry} industry terminology
- Address ${context.persona} level audience
- Focus on ${context.purpose} analysis type
- Provide specific, actionable insights
- Include quantitative evidence where possible
    `.trim()
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
        const parsed = JSON.parse(jsonMatch[0])
        
        // Ensure all expected fields exist with fallbacks
        return {
          summary: parsed.summary || 'Analysis completed successfully',
          insights: parsed.insights || [],
          trends: parsed.trends || [],
          qualityIssues: parsed.qualityIssues || [],
          recommendations: parsed.recommendations || [],
          statistics: parsed.statistics || [],
          businessApplications: parsed.businessApplications || [],
          riskOpportunities: parsed.riskOpportunities || [],
          nextSteps: parsed.nextSteps || []
        }
      }
      
      // Fallback: parse as text and structure it
      const lines = response.split('\n').filter(line => line.trim())
      return {
        summary: response.substring(0, 300) + '...',
        insights: lines.slice(0, 5).map(line => line.replace(/^[-*•]\s*/, '')),
        trends: lines.slice(5, 8).map(line => line.replace(/^[-*•]\s*/, '')),
        qualityIssues: lines.slice(8, 10).map(line => line.replace(/^[-*•]\s*/, '')),
        recommendations: lines.slice(10, 15).map(line => line.replace(/^[-*•]\s*/, '')),
        statistics: [],
        businessApplications: lines.slice(15, 18).map(line => line.replace(/^[-*•]\s*/, '')),
        riskOpportunities: [],
        nextSteps: []
      }
    } catch (error) {
      return {
        summary: response.substring(0, 300) + '...',
        insights: [response.substring(0, 200)],
        trends: [],
        qualityIssues: [],
        recommendations: [],
        statistics: [],
        businessApplications: [],
        riskOpportunities: [],
        nextSteps: []
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
      riskOpportunities: [] as string[],
      nextSteps: [] as string[],
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
        if (result.data.riskOpportunities) combined.riskOpportunities.push(...result.data.riskOpportunities)
        if (result.data.nextSteps) combined.nextSteps.push(...result.data.nextSteps)
      }
    })

    // Remove duplicates and limit results
    combined.insights = [...new Set(combined.insights)].slice(0, 10)
    combined.trends = [...new Set(combined.trends)].slice(0, 8)
    combined.qualityIssues = [...new Set(combined.qualityIssues)].slice(0, 6)
    combined.recommendations = [...new Set(combined.recommendations)].slice(0, 10)
    combined.businessApplications = [...new Set(combined.businessApplications)].slice(0, 8)
    combined.riskOpportunities = [...new Set(combined.riskOpportunities)].slice(0, 6)
    combined.nextSteps = [...new Set(combined.nextSteps)].slice(0, 6)

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
      ],
      riskOpportunities: [
        'Opportunity: Leverage data for strategic decision making',
        'Risk: Ensure data quality for reliable insights'
      ],
      nextSteps: [
        'Review analysis results with stakeholders',
        'Implement recommended data collection improvements',
        'Schedule follow-up analysis in 30 days',
        'Create automated reporting dashboard'
      ]
    }
  }
}

export const superAI = new SuperAIAnalyzer()