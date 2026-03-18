import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

const INIT_EMAILS = [
  { id:'1', date:'2026-03-15', party:'New India Assurance', subject:'Survey report acknowledgement for CLM-2601', claim:'CLM-2601', direction:'received', notes:'They confirmed receipt of survey report' },
  { id:'2', date:'2026-03-13', party:'ICICI Lombard', subject:'Survey appointment confirmation for CLM-2602', claim:'CLM-2602', direction:'sent', notes:'Confirmed site visit for 15 March' },
  { id:'3', date:'2026-03-10', party:'Suresh Patel', subject:'Documents required for health claim CLM-2603', claim:'CLM-2603', direction:'sent', notes:'Sent checklist of required documents' },
  { id:'4', date:'2026-03-08', party:'Bajaj Allianz', subject:'Approval letter for CLM-2604', claim:'CLM-2604', direction:'received', notes:'Claim approved — settlement in process' },
  { id:'5', date:'2026-03-05', party:'United India Insurance', subject:'Final settlement for CLM-2605', claim:'CLM-2605', direction:'received', notes:'Settlement cheque dispatched' },
]

export default function EmailsPage() {
  const router = useRouter()
  const [emails, setEmails] = useState(INIT_EMAILS)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ party:'', subject:'', claim:'', direction:'sent', notes:'', date:'' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data:{session} }) => {
      if (!session) router.push('/')
    })
  }, [])

  const filtered = emails.filter(e => {
    const q = search.toLowerCase()
    return !q || e.party.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q) || e.claim.toLowerCase().includes(q)
  })

  function save() {
    if (!form.party || !form.subject) return alert('Party and subject required')
    setEmails(prev => [{ ...form, id:String(Date.now()), date: form.date || new Date().toISOString().slice(0,10) }, ...prev])
    setShowModal(false)
    setForm({ party:'', subject:'', claim:'', direction:'sent', notes:'', date:'' })
  }

  const inputStyle = {
    width:'100%', padding:'9px 12px', fontSize:13,
    border:'1.5px solid #e5e7eb', borderRadius:8,
    outline:'none', color:'#1a1a2e', background:'#fafafa', fontFamily:'inherit'
  }

  return (
    <>
      <Head><title>Email Log — Astute IMS</title></Head>
      <Layout active="email log">
        <div className="animate-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 }}>Correspondence Log</h1>
              <p style={{ color:'#6b7280', fontSize:13, marginTop:3 }}>Track all emails & communications</p>
            </div>
            <button onClick={()=>setShowModal(true)} style={{
              padding:'10px 20px', background:'linear-gradient(135deg,#667eea,#764ba2)',
              color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer'
            }}>+ Log Email</button>
          </div>

          {/* Summary */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
            {[
              { label:'Total Emails', value:emails.length, icon:'✉️', color:'#3b5bdb' },
              { label:'Sent', value:emails.filter(e=>e.direction==='sent').length, icon:'📤', color:'#059669' },
              { label:'Received', value:emails.filter(e=>e.direction==='received').length, icon:'📥', color:'#d97706' },
            ].map((c,i)=>(
              <div key={i} style={{ background:'white', borderRadius:10, padding:'14px 16px', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:24 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize:22, fontWeight:700, color:c.color }}>{c.value}</div>
                  <div style={{ fontSize:12, color:'#9ca3af' }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          <input placeholder="🔍 Search by party, subject, or claim ID..." value={search}
            onChange={e=>setSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom:14, display:'block' }} />

          <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#fafafa', borderBottom:'1px solid #e5e7eb' }}>
                  {['Date','Direction','Party','Subject','Claim ID','Notes'].map(h=>(
                    <th key={h} style={{ padding:'11px 16px', textAlign:'left', fontWeight:600, color:'#6b7280', fontSize:12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e,i)=>(
                  <tr key={e.id} style={{ borderBottom: i<filtered.length-1?'1px solid #f3f4f6':undefined }}
                    onMouseEnter={ev=>(ev.currentTarget.style.background='#f9fafb')}
                    onMouseLeave={ev=>(ev.currentTarget.style.background='white')}>
                    <td style={{ padding:'12px 16px', color:'#9ca3af', fontSize:12 }}>{e.date}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{
                        padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600,
                        background: e.direction==='sent'?'#d4edda':'#cfe2ff',
                        color: e.direction==='sent'?'#155724':'#084298'
                      }}>{e.direction==='sent'?'📤 Sent':'📥 Received'}</span>
                    </td>
                    <td style={{ padding:'12px 16px', fontWeight:500 }}>{e.party}</td>
                    <td style={{ padding:'12px 16px' }}>{e.subject}</td>
                    <td style={{ padding:'12px 16px', fontWeight:600, color:'#3b5bdb' }}>{e.claim}</td>
                    <td style={{ padding:'12px 16px', color:'#6b7280', fontSize:12 }}>{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length===0 && (
              <div style={{ padding:'40px', textAlign:'center', color:'#9ca3af' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>✉️</div>
                <p>No emails found</p>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div style={{ background:'white', borderRadius:16, padding:28, width:480, boxShadow:'0 25px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:17, fontWeight:700, margin:0 }}>Log Correspondence</h2>
                <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#6b7280' }}>×</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Party Name *</label>
                  <input placeholder="Company or person" value={form.party} onChange={e=>setForm(p=>({...p,party:e.target.value}))} style={inputStyle} />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Subject *</label>
                  <input placeholder="Email subject" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Claim ID</label>
                  <input placeholder="CLM-2601" value={form.claim} onChange={e=>setForm(p=>({...p,claim:e.target.value}))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Direction</label>
                  <select value={form.direction} onChange={e=>setForm(p=>({...p,direction:e.target.value}))} style={inputStyle}>
                    <option value="sent">📤 Sent</option>
                    <option value="received">📥 Received</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Date</label>
                  <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  placeholder="Summary of the communication..." rows={3} style={{ ...inputStyle, resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                <button onClick={()=>setShowModal(false)} style={{ padding:'10px 20px', border:'1px solid #e5e7eb', borderRadius:8, background:'white', fontSize:14, cursor:'pointer' }}>Cancel</button>
                <button onClick={save} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>Log Email</button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
