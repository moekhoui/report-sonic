import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { withLimitCheck } from '../../../src/middleware/limitCheck'
import { analyzeData, generateReportContent } from '../../../src/lib/ai'
import { calculateCells } from '../../../src/utils/pricingCalculator'
import UserMySQL from '../../../src/lib/models/UserMySQL'

async function generateReportHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  fileData: any[]
) {
  try {
    const session = await getSession({ req })
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { title, template, companyName, clientName } = req.body

    // Validate required fields
    if (!title || !template) {
      return res.status(400).json({ error: 'Title and template are required' })
    }

    // Calculate cells used for this report
    const cellsUsed = calculateCells(fileData)

    // Generate AI analysis
    const analysis = await analyzeData(fileData)
    
    // Generate report content
    const reportContent = await generateReportContent(fileData, template, title)

    // Don't store report in database to save storage space
    // Just track usage and return the generated report
    
    // Increment usage (this is called after successful report generation)
    await UserMySQL.incrementUsage(parseInt(session.user.id), cellsUsed, 1)
    await UserMySQL.logUsage(parseInt(session.user.id), null, 'report_generated', cellsUsed, 1, { 
      title,
      template,
      companyName,
      clientName
    })

    res.status(200).json({
      success: true,
      reportId: `temp_${Date.now()}`, // Temporary ID for frontend reference
      analysis,
      reportContent,
      cellsUsed,
      message: 'Report generated successfully'
    })
  } catch (error) {
    console.error('Report generation error:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
}

export default withLimitCheck(generateReportHandler)
