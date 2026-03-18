import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { sanitizeInput, generateClaimId } from '../lib/security'
import Layout from '../components/Layout'

const MOCK_CLAIMS = [
  { id:'1', claim_number:'CLM-2601', insured_name:'Ramesh Gupta', policy_number:'POL-2456', insurance_company:'New India Assurance', claim_type:'Fire', incident_date:'2026-03-01', surveyor:'Rajesh Kumar', status:'under_survey', claim_amount:250000, priority:'high', description:'Fire damage to godown' },
  { id:'2', claim_number:'CLM-2602', insured_name:'Priya Mehta', policy_number:'POL-1892', insurance_company:'ICICI Lombard', claim_type:'Motor', incident_date:'2026-03-05', surveyor:'Priya Sharma', status:'report_submitted', claim_amount:85000, priority:'normal', description:'Vehicle collision on NH8' },
  { id:'3', claim_number:'CLM-2603', insured_name:'Suresh Patel', policy_number:'POL-3301', insurance_company:'LIC of India', claim_type:'Health', incident_date:'2026-03-08', surveyor:'Amit Verma', status:'pending', claim_amount:45000, priority:'normal', description:'Hospitalisation' },
  { id:'4', claim_number:'CLM-2604', insured_name:'Anita Singh', policy_number:'POL-0987', insurance_company:'Bajaj Allianz', claim_type:'Burglary', incident_date:'2026-02-20', surveyor:'Sunita Joshi', status:'approved', claim_amount:120000, priority:'high', description:'Shop burglary' },
  { id:'5', claim_number:'CLM-2605', insured_name:'Vijay Sharma', policy_number:'POL-4412', insurance_company:'United India', claim_type:'Marine', incident_date:'2026-02-15', surveyor:'Rajesh Kumar', status:'closed', claim_amount:380000, priority:'urgent', description:'Cargo damage' },
  { id:'6', claim_number:'CLM-2606', insured_name:'Deepa Nair', policy_number:'POL-2201', insurance_company:'HDFC ERGO', claim_type:'Engineering', incident_date:'2026-03-10', surveyor:'Priya Sharma', status:'pending', claim_amount:65000, priority:'normal', description:'Machinery breakdown' },
]

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#856404', bg: '#fff3cd' },
  under_survey: { label: 'Under Survey', color: '#084298', bg: '#cfe2ff' },
  report_submitted: { label: 'Report Submitted', color: '#0c5460', bg: '#d1ecf1' },
  approved: { label: 'Approved', color: '#155724', bg: '#d4edda' },
  closed: { label: 'Closed', color: '#383d41', bg: '#e2e3e5' },
  rejected: { label: 'Rejected', color: '#721c24', bg: '#f8d7da' },
}

const PRIORITY_MAP: Record<string, { label: string; color: string; bg: string }> = {
  normal: { label: 'Normal', color: '#383d41', bg: '#e2e3e5' },
  high: { label: 'High', color: '#856404', bg: '#fff3cd' },
  urgent: { label: 'Urgent', color: '#721c24', bg: '#f8d7da' },
}

export default function ClaimsPage() {
  const router = useRouter()
  const [claims, setClaims] = useState(MOCK_CLAIMS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    insured_name: '', policy_number: '', insurance_company: 'New India Assurance',
    claim_type: 'Fire', incident_date: '', claim_amount: '', priority: 'normal',
    surveyor: 'Rajesh Kumar', description: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
    })
  }, [])

  const filtered = claims.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.claim_number.toLowerCase().includes(q) || c.insured_name.toLowerCase().includes(q) || c.policy_number.toLowerCase().includes(q)
    const matchS = !statusFilter || c.status === statusFilter
    return matchQ && matchS
  })

  async function saveClaim() {
    if (!form.insured_name || !form.policy_number) return alert('Fill required fields')
    setSaving(true)
    // In production: await supabase.from('claims').insert({...})
    const newClaim = {
      id: String(claims.length + 1),
      claim_number: generateClaimId(claims.length),
      insured_name: sanitizeInput(form.insured_name),
      policy_number: sanitizeInput(form.policy_number),
      insurance_company: form.insurance_company,
      claim_type: form.claim_type,
      incident_date: form.incident_date,
      surveyor: form.surveyor,
      status: 'pending',
      claim_amount: parseInt(form.claim_amount) || 0,
      priority: form.priority,
      description: sanitizeInput(form.description),
    }
    setClaims(prev => [newClaim, ...prev])
    setShowModal(false)
    setForm({ insured_name:'', policy_number:'', insurance_company:'New India Assurance', claim_type:'Fire', incident_date:'', claim_amount:'', priority:'normal', surveyor:'Rajesh Kumar', description:'' })
    setSaving(false)
    alert(`✅ ${newClaim.claim_number} created successfully!`)
  }

  function advanceStatus(id: string) {
    const order = ['pending','under_survey','report_submitted','approved','closed']
    setClaims(prev => prev.map(c => {
      if (c.id !== id) return c
      const i = order.indexOf(c.status)
      return { ...c, status: order[Math.min(i+1, order.length-1)] }
    }))
  }

  const inputStyle = {
    width:'100%', padding:'9px 12px', fontSize:13,
    border:'1.5px solid #e5e7eb', borderRadius:8,
    outline:'none', color:'#1a1a2e', background:'#fafafa',
    fontFamily:'inherit'
  }

  return (
    <>
      <Head><title>Claims — Astute IMS</title></Head>
      <Layout active="claims">
        <div className="animate-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 }}>Claims Management</h1>
              <p style={{ color:'#6b7280', fontSize:13, marginTop:3 }}>{filtered.length} claims found</p>
            </div>
            <button onClick={() => setShowModal(true)} style={{
              padding:'10px 20px', background:'linear-gradient(135deg,#667eea,#764ba2)',
              color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600,
              cursor:'pointer'
            }}>+ New Claim</button>
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:10, marginBottom:16 }}>
            <input
              placeholder="🔍 Search by name, claim ID, policy..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, flex:1 }}
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width:180 }}>
              <option value="">All Status</option>
              {Object.entries(STATUS_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid #e5e7eb' }}>
                    {['Claim ID','Insured','Policy No.','Type','Date','Surveyor','Status','Amount','Priority','Action'].map(h => (
                      <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontWeight:600, color:'#6b7280', fontSize:12, background:'#fafafa', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const s = STATUS_MAP[c.status] || STATUS_MAP.pending
                    const p = PRIORITY_MAP[c.priority] || PRIORITY_MAP.normal
                    return (
                      <tr key={c.id} style={{ borderBottom:'1px solid #f3f4f6', transition:'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget.style.background='#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background='white')}>
                        <td style={{ padding:'12px 14px', fontWeight:600, color:'#3b5bdb' }}>{c.claim_number}</td>
                        <td style={{ padding:'12px 14px', fontWeight:500 }}>{c.insured_name}</td>
                        <td style={{ padding:'12px 14px', color:'#6b7280', fontSize:12 }}>{c.policy_number}</td>
                        <td style={{ padding:'12px 14px' }}>{c.claim_type}</td>
                        <td style={{ padding:'12px 14px', color:'#6b7280', fontSize:12 }}>{c.incident_date}</td>
                        <td style={{ padding:'12px 14px' }}>{c.surveyor}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:s.bg, color:s.color }}>
                            {s.label}
                          </span>
                        </td>
                        <td style={{ padding:'12px 14px', fontWeight:600 }}>₹{c.claim_amount.toLocaleString('en-IN')}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:p.bg, color:p.color }}>
                            {p.label}
                          </span>
                        </td>
                        <td style={{ padding:'12px 14px' }}>
                          <button onClick={() => advanceStatus(c.id)} style={{
                            padding:'5px 12px', fontSize:12, fontWeight:500, borderRadius:6,
                            border:'1px solid #e5e7eb', background:'white', cursor:'pointer',
                            color:'#374151', transition:'all 0.1s'
                          }}>Advance →</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Claim Modal */}
        {showModal && (
          <div style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
          }}>
            <div style={{
              background:'white', borderRadius:16, padding:28, width:540,
              maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 60px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:700, margin:0 }}>Add New Claim</h2>
                <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#6b7280' }}>×</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { label:'Insured Name *', key:'insured_name', type:'text', placeholder:'Full name' },
                  { label:'Policy Number *', key:'policy_number', type:'text', placeholder:'POL-XXXX' },
                  { label:'Claim Amount (₹)', key:'claim_amount', type:'number', placeholder:'0' },
                  { label:'Incident Date', key:'incident_date', type:'date', placeholder:'' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                {[
                  { label:'Insurance Company', key:'insurance_company', options:['New India Assurance','LIC of India','ICICI Lombard','Bajaj Allianz','United India','HDFC ERGO'] },
                  { label:'Claim Type', key:'claim_type', options:['Fire','Motor','Marine','Health','Burglary','Engineering','Miscellaneous'] },
                  { label:'Assign Surveyor', key:'surveyor', options:['Rajesh Kumar','Priya Sharma','Amit Verma','Sunita Joshi'] },
                  { label:'Priority', key:'priority', options:['normal','high','urgent'] },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>{f.label}</label>
                    <select value={(form as any)[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))} style={inputStyle}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({...p, description:e.target.value}))}
                  placeholder="Brief incident description..." rows={3}
                  style={{ ...inputStyle, resize:'vertical' }}
                />
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                <button onClick={() => setShowModal(false)} style={{
                  padding:'10px 20px', border:'1px solid #e5e7eb', borderRadius:8,
                  background:'white', fontSize:14, cursor:'pointer', color:'#374151'
                }}>Cancel</button>
                <button onClick={saveClaim} disabled={saving} style={{
                  padding:'10px 24px', background:'linear-gradient(135deg,#667eea,#764ba2)',
                  color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600,
                  cursor:'pointer'
                }}>{saving ? 'Saving...' : '✅ Save Claim'}</button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
