import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import StatsGrid from '../components/StatsGrid'
import RecentClaims, { ActivityFeed, QuickActions } from '../components/RecentClaims'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, closed: 0, surveyors: 0, totalAmount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    loadStats()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/')
      return
    }
    setUser(session.user)
    setLoading(false)
  }

  async function loadStats() {
    try {
      // In production, these come from Supabase
      // Using mock data for demo
      setStats({ total: 6, pending: 2, closed: 3, surveyors: 4, totalAmount: 945000 })
    } catch (err) {
      console.error('Stats load error:', err)
    }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f9fc' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
        <p style={{ color:'#6b7280', fontSize:14 }}>Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Dashboard — Astute IMS</title></Head>
      <Layout user={user} active="dashboard">
        <div className="animate-in">
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
              Good morning! 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
              Here's what's happening with your claims today.
            </p>
          </div>

          <StatsGrid stats={stats} />
          <QuickActions />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginTop: 24 }}>
            <RecentClaims />
            <ActivityFeed />
          </div>
        </div>
      </Layout>
    </>
  )
}


