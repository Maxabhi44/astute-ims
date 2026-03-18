import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!email.includes('@')) { setError('Valid email required'); return }
    if (password.length < 8) { setError('Password must be 8+ characters'); return }

    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email to confirm your account!')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login — Astute IMS</title>
      </Head>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          background: 'white', borderRadius: 16, padding: '40px 36px',
          width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 12
            }}>🛡️</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Astute IMS</h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>
              Insurance Management System
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14,
                  border: '1.5px solid #e5e7eb', borderRadius: 8,
                  outline: 'none', color: '#1a1a2e', background: '#fafafa'
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                style={{
                  width: '100%', padding: '10px 14px', fontSize: 14,
                  border: '1.5px solid #e5e7eb', borderRadius: 8,
                  outline: 'none', color: '#1a1a2e', background: '#fafafa'
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13,
                background: error.includes('Check') ? '#d4edda' : '#fef2f2',
                color: error.includes('Check') ? '#155724' : '#991b1b',
                border: `1px solid ${error.includes('Check') ? '#c3e6cb' : '#fecaca'}`
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px', fontSize: 15, fontWeight: 600,
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Sign In' : '✅ Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              style={{ color: '#667eea', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <div style={{ marginTop: 24, padding: '12px', background: '#f8f9ff', borderRadius: 8, border: '1px dashed #c7d2fe' }}>
            <p style={{ fontSize: 11, color: '#6366f1', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
              🔒 <strong>Demo:</strong> Create an account to explore all features.<br/>
              All data is secured with Row Level Security (RLS).
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
