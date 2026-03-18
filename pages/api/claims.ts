import type { NextApiRequest, NextApiResponse } from 'next'
import { rateLimit, sanitizeInput } from '../../lib/security'
import { supabaseAdmin } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] as string || 'unknown'
  const limit = rateLimit(`claims:${ip}`, 30, 60_000)
  if (!limit.success) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  // Auth check
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    try {
      // In production: query Supabase with user's RLS policies
      // const supabase = supabaseAdmin()
      // const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false })

      // Mock response for demo
      return res.status(200).json({
        data: [],
        message: 'Connect Supabase to get real data'
      })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch claims' })
    }
  }

  if (req.method === 'POST') {
    const { insured_name, policy_number, claim_amount, description } = req.body

    // Validate required fields
    if (!insured_name || !policy_number) {
      return res.status(400).json({ error: 'insured_name and policy_number are required' })
    }

    // Validate amount
    if (claim_amount && (isNaN(claim_amount) || claim_amount < 0 || claim_amount > 100_000_000)) {
      return res.status(400).json({ error: 'Invalid claim amount' })
    }

    const sanitized = {
      insured_name: sanitizeInput(insured_name),
      policy_number: sanitizeInput(policy_number),
      description: description ? sanitizeInput(description) : null,
      claim_amount: parseFloat(claim_amount) || 0,
    }

    // In production: insert to Supabase
    return res.status(201).json({ data: sanitized, message: 'Claim created successfully' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
