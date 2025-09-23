import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { withLimitCheck, incrementUserUsage } from '../../../src/middleware/limitCheck'
import { analyzeData, generateReportContent } from '../../../src/lib/ai'
import { calculateCells } from '../../../src/utils/pricingCalculator'
import { query } from '../../../src/lib/mysql'

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

    // Save report to database
    const reportResult = await query(
      `INSERT INTO reports (user_id, title, data, charts, settings, cells_used) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parseInt(session.user.id),
        title,
        JSON.stringify(fileData),
        JSON.stringify(analysis.suggestedCharts || []),
        JSON.stringify({
          template,
          companyName,
          clientName,
          reportContent
        }),
        cellsUsed
      ]
    ) as any

    const reportId = reportResult.insertId

    // Increment usage (this is called after successful report generation)
    await incrementUserUsage(parseInt(session.user.id), cellsUsed, reportId)

    res.status(200).json({
      success: true,
      reportId,
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
