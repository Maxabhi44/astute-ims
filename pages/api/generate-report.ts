import type { NextApiRequest, NextApiResponse } from 'next'
import { rateLimit } from '../../lib/security'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security: Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting: 5 reports per minute per IP
  const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown'
  const limit = rateLimit(`report:${ip}`, 5, 60_000)
  if (!limit.success) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment.',
      resetIn: Math.ceil(limit.resetIn / 1000)
    })
  }

  // Validate API key exists
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  const { reportType, period, claimsData, companyFilter } = req.body

  // Input validation
  if (!reportType || !period) {
    return res.status(400).json({ error: 'reportType and period are required' })
  }

  try {
    const prompt = buildReportPrompt(reportType, period, claimsData, companyFilter)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const reportText = data.content?.[0]?.text || 'Report generation failed'

    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'no-store')

    return res.status(200).json({
      report: reportText,
      generatedAt: new Date().toISOString(),
      reportType,
      period
    })

  } catch (error: any) {
    console.error('Report generation error:', error)
    return res.status(500).json({ error: 'Failed to generate report. Please try again.' })
  }
}

function buildReportPrompt(type: string, period: string, claims: any[], company: string): string {
  const total = claims?.length || 6
  const totalAmount = claims?.reduce((a: number, c: any) => a + (c.claim_amount || 0), 0) || 945000
  const pending = claims?.filter((c: any) => c.status === 'pending').length || 2
  const closed = claims?.filter((c: any) => c.status === 'closed').length || 3

  return `You are a professional insurance report writer for Astute Insurance Surveyors & Loss Assessors Pvt. Ltd.

Generate a formal ${type} for the period: ${period}
Insurance company filter: ${company || 'All Companies'}

Key data:
- Total Claims: ${total}
- Total Claim Value: ₹${totalAmount.toLocaleString('en-IN')}
- Pending Claims: ${pending}
- Closed/Settled: ${closed}
- Settlement Rate: ${Math.round((closed/total)*100)}%

Write a professional report with:
1. Executive Summary (2-3 lines)
2. Key Metrics & Findings
3. Notable Observations
4. Recommendations

Keep it concise, formal, and professional. Use Indian insurance industry terminology. Format with clear sections.`
}
