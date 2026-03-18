// In-memory rate limiter (use Redis in production for multi-instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: limit - 1, resetIn: windowMs }
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    }
  }

  record.count++
  return {
    success: true,
    remaining: limit - record.count,
    resetIn: record.resetTime - now,
  }
}

// Sanitize inputs to prevent XSS / SQL injection
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // strip HTML tags
    .replace(/'/g, "''")  // escape single quotes
    .slice(0, 1000)        // max length
}

// Validate claim number format
export function isValidClaimNumber(claimNo: string): boolean {
  return /^CLM-\d{4,6}$/.test(claimNo)
}

// Validate Indian phone number
export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''))
}

// Check if user has required role
export function hasRole(userRole: string, requiredRole: string): boolean {
  const hierarchy: Record<string, number> = {
    viewer: 1,
    backend_executive: 2,
    surveyor: 2,
    manager: 3,
    admin: 4,
  }
  return (hierarchy[userRole] ?? 0) >= (hierarchy[requiredRole] ?? 99)
}

// Generate secure claim ID
export function generateClaimId(existingCount: number): string {
  const year = new Date().getFullYear().toString().slice(-2)
  const num = String(existingCount + 1).padStart(4, '0')
  return `CLM-${year}${num}`
}
