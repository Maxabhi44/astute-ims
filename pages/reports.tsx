import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

export default function ReportsPage() {
  const router = useRouter()
  const [reportType, setReportType] = useState('Monthly Claim Summary')
  const [period, setPeriod] = useState('March 2026')
  const [company, setCompany] = useState('All Companies')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
    })
  }, [])

  async function generateReport() {
    setLoading(true)
    setError('')
    setReport('')

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType, period, companyFilter: company,
          claimsData: [] // In production, pass actual claims data
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setReport(data.report)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectStyle = {
    width:'100%', padding:'9px 12px', fontSize:13,
    border:'1.5px solid #e5e7eb', borderRadius:8,
    outline:'none', color:'#1a1a2e', background:'#fafafa', fontFamily:'inherit'
  }

  const barData = [
    { label:'Fire', value:1, total:6 },
    { label:'Motor', value:1, total:6 },
    { label:'Marine', value:1, total:6 },
    { label:'Health', value:1, total:6 },
    { label:'Burglary', value:1, total:6 },
    { label:'Engineering', value:1, total:6 },
  ]

  const statusData = [
    { label:'Pending', value:2, color:'#f59e0b' },
    { label:'Under Survey', value:1, color:'#3b82f6' },
    { label:'Submitted', value:1, color:'#06b6d4' },
    { label:'Approved', value:1, color:'#22c55e' },
    { label:'Closed', value:1, color:'#9ca3af' },
  ]

  return (
    <>
      <Head><title>Reports — Astute IMS</title></Head>
      <Layout active="reports">
        <div className="animate-in">
          <div style={{ marginBottom:20 }}>
            <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 }}>Reports & Analytics</h1>
            <p style={{ color:'#6b7280', fontSize:13, marginTop:3 }}>AI-powered report generation</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:20, marginBottom:20 }}>
            {/* Generator */}
            <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', padding:20 }}>
              <h2 style={{ fontSize:15, fontWeight:600, margin:'0 0 16px' }}>🤖 AI Report Generator</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Report Type</label>
                  <select value={reportType} onChange={e => setReportType(e.target.value)} style={selectStyle}>
                    {['Monthly Claim Summary','Surveyor Performance','Pending Claims Analysis','Settlement Report','Policy-wise Breakdown'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Period</label>
                  <select value={period} onChange={e => setPeriod(e.target.value)} style={selectStyle}>
                    {['March 2026','February 2026','January 2026','Q1 2026','FY 2025-26'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Company</label>
                  <select value={company} onChange={e => setCompany(e.target.value)} style={selectStyle}>
                    {['All Companies','LIC of India','New India Assurance','ICICI Lombard','Bajaj Allianz','United India','HDFC ERGO'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button onClick={generateReport} disabled={loading} style={{
                  padding:'12px', fontSize:14, fontWeight:600,
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg,#667eea,#764ba2)',
                  color:'white', border:'none', borderRadius:8, cursor: loading ? 'not-allowed':'pointer',
                  marginTop:4
                }}>
                  {loading ? '⏳ Generating with AI...' : '✨ Generate Report'}
                </button>
              </div>
            </div>

            {/* Output */}
            <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', padding:20 }}>
              <h2 style={{ fontSize:15, fontWeight:600, margin:'0 0 16px' }}>Report Output</h2>
              {error && (
                <div style={{ padding:'12px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, color:'#991b1b', fontSize:13, marginBottom:12 }}>
                  ❌ {error}
                </div>
              )}
              {!report && !loading && !error && (
                <div style={{ textAlign:'center', padding:'40px 20px', color:'#9ca3af' }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
                  <p style={{ fontSize:14 }}>Select options and click Generate to create an AI-powered report</p>
                </div>
              )}
              {loading && (
                <div style={{ textAlign:'center', padding:'40px 20px', color:'#6b7280' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
                  <p style={{ fontSize:14 }}>Claude AI is analysing your data...</p>
                  <p style={{ fontSize:12, color:'#9ca3af', marginTop:6 }}>This takes 5-10 seconds</p>
                </div>
              )}
              {report && (
                <div style={{ background:'#f8f9ff', borderRadius:8, padding:16, fontSize:13, lineHeight:1.8, whiteSpace:'pre-wrap', color:'#1a1a2e', border:'1px solid #e0e7ff' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:'#6366f1' }}>✨ AI Generated • {new Date().toLocaleDateString('en-IN')}</span>
                    <button onClick={() => navigator.clipboard.writeText(report)} style={{
                      padding:'4px 10px', fontSize:11, border:'1px solid #e0e7ff',
                      borderRadius:6, background:'white', cursor:'pointer', color:'#6366f1'
                    }}>📋 Copy</button>
                  </div>
                  {report}
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, margin:'0 0 16px', color:'#374151' }}>Claims by Type</h3>
              {barData.map((d, i) => (
                <div key={i} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4, color:'#374151' }}>
                    <span>{d.label}</span><span style={{ fontWeight:600 }}>{d.value}</span>
                  </div>
                  <div style={{ height:8, background:'#f3f4f6', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.round(d.value/d.total*100)}%`, background:'linear-gradient(90deg,#667eea,#764ba2)', borderRadius:4, transition:'width 0.5s ease' }}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', padding:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, margin:'0 0 16px', color:'#374151' }}>Status Breakdown</h3>
              {statusData.map((d, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:12, height:12, borderRadius:3, background:d.color }}/>
                    <span style={{ fontSize:13 }}>{d.label}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:120, height:8, background:'#f3f4f6', borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${d.value/6*100}%`, background:d.color, borderRadius:4 }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:600, minWidth:16 }}>{d.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
