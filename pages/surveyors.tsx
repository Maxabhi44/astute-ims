import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

const SURVEYORS = [
  { id:'1', name:'Rajesh Kumar', email:'rajesh@astute.com', phone:'9876543210', specialty:'Fire & Engineering', status:'in_field', rating:4.8, active:2, completed:18 },
  { id:'2', name:'Priya Sharma', email:'priya@astute.com', phone:'9765432109', specialty:'Motor & Health', status:'office', rating:4.9, active:2, completed:24 },
  { id:'3', name:'Amit Verma', email:'amit@astute.com', phone:'9654321098', specialty:'Marine & Burglary', status:'available', rating:4.6, active:1, completed:12 },
  { id:'4', name:'Sunita Joshi', email:'sunita@astute.com', phone:'9543210987', specialty:'All Lines', status:'in_field', rating:4.7, active:1, completed:20 },
]

const STATUS_MAP: Record<string, { label:string; color:string; bg:string }> = {
  available: { label:'Available', color:'#155724', bg:'#d4edda' },
  in_field: { label:'In Field', color:'#084298', bg:'#cfe2ff' },
  office: { label:'In Office', color:'#383d41', bg:'#e2e3e5' },
  leave: { label:'On Leave', color:'#856404', bg:'#fff3cd' },
}

export default function SurveyorsPage() {
  const router = useRouter()
  const [surveyors, setSurveyors] = useState(SURVEYORS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', specialty:'Fire', status:'available' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/')
    })
  }, [])

  function saveSurveyor() {
    if (!form.name || !form.email) return alert('Name and email required')
    setSurveyors(prev => [...prev, {
      id: String(prev.length + 1), ...form,
      rating: 0, active: 0, completed: 0
    }])
    setShowModal(false)
    setForm({ name:'', email:'', phone:'', specialty:'Fire', status:'available' })
  }

  function updateStatus(id: string, status: string) {
    setSurveyors(prev => prev.map(s => s.id === id ? { ...s, status } : s))
  }

  const inputStyle = {
    width:'100%', padding:'9px 12px', fontSize:13,
    border:'1.5px solid #e5e7eb', borderRadius:8,
    outline:'none', color:'#1a1a2e', background:'#fafafa', fontFamily:'inherit'
  }

  return (
    <>
      <Head><title>Surveyors — Astute IMS</title></Head>
      <Layout active="surveyors">
        <div className="animate-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 }}>Surveyor Coordination</h1>
              <p style={{ color:'#6b7280', fontSize:13, marginTop:3 }}>{surveyors.length} surveyors registered</p>
            </div>
            <button onClick={() => setShowModal(true)} style={{
              padding:'10px 20px', background:'linear-gradient(135deg,#667eea,#764ba2)',
              color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer'
            }}>+ Add Surveyor</button>
          </div>

          {/* Summary row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { label:'Available', value: surveyors.filter(s=>s.status==='available').length, color:'#059669' },
              { label:'In Field', value: surveyors.filter(s=>s.status==='in_field').length, color:'#3b5bdb' },
              { label:'In Office', value: surveyors.filter(s=>s.status==='office').length, color:'#6b7280' },
              { label:'Total Claims', value: surveyors.reduce((a,s)=>a+s.active,0), color:'#d97706' },
            ].map((c,i) => (
              <div key={i} style={{ background:'white', borderRadius:10, padding:'14px 16px', border:'1px solid #e5e7eb' }}>
                <div style={{ fontSize:11, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{c.label}</div>
                <div style={{ fontSize:26, fontWeight:700, color:c.color, marginTop:4 }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Surveyor cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
            {surveyors.map(s => {
              const st = STATUS_MAP[s.status] || STATUS_MAP.available
              return (
                <div key={s.id} style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <div style={{
                        width:44, height:44, borderRadius:12,
                        background:'linear-gradient(135deg,#667eea20,#764ba220)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:18, fontWeight:700, color:'#667eea'
                      }}>{s.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:15, color:'#1a1a2e' }}>{s.name}</div>
                        <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>{s.specialty}</div>
                      </div>
                    </div>
                    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:st.bg, color:st.color }}>{st.label}</span>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14, fontSize:12, color:'#6b7280' }}>
                    <div>📧 {s.email}</div>
                    <div>📞 {s.phone}</div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, background:'#f8f9ff', borderRadius:8, overflow:'hidden', marginBottom:14 }}>
                    {[
                      { label:'Active', value:s.active, color:'#3b5bdb' },
                      { label:'Completed', value:s.completed, color:'#059669' },
                      { label:'Rating', value:s.rating || '—', color:'#d97706' },
                    ].map((m,i) => (
                      <div key={i} style={{ padding:'10px 0', textAlign:'center', borderRight: i<2 ? '1px solid #e5e7eb':undefined }}>
                        <div style={{ fontSize:20, fontWeight:700, color:m.color }}>{m.value}</div>
                        <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:'flex', gap:6 }}>
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                      <button key={key} onClick={() => updateStatus(s.id, key)} style={{
                        flex:1, padding:'6px 4px', fontSize:11, fontWeight:500,
                        border: s.status===key ? `2px solid ${val.color}` : '1px solid #e5e7eb',
                        borderRadius:6, cursor:'pointer', background: s.status===key ? val.bg : 'white',
                        color: s.status===key ? val.color : '#6b7280',
                      }}>{val.label}</button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div style={{ background:'white', borderRadius:16, padding:28, width:460, boxShadow:'0 25px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:17, fontWeight:700, margin:0 }}>Add New Surveyor</h2>
                <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#6b7280' }}>×</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { label:'Full Name *', key:'name', placeholder:'Surveyor name' },
                  { label:'Email *', key:'email', placeholder:'email@domain.com' },
                  { label:'Phone', key:'phone', placeholder:'10-digit number' },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.key==='name'?'1/-1':undefined }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>{f.label}</label>
                    <input placeholder={f.placeholder} value={(form as any)[f.key]}
                      onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Specialty</label>
                  <select value={form.specialty} onChange={e => setForm(p=>({...p,specialty:e.target.value}))} style={inputStyle}>
                    {['Fire','Motor','Marine','Health','Burglary','Engineering','All Lines'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Initial Status</label>
                  <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))} style={inputStyle}>
                    {Object.entries(STATUS_MAP).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                <button onClick={()=>setShowModal(false)} style={{ padding:'10px 20px', border:'1px solid #e5e7eb', borderRadius:8, background:'white', fontSize:14, cursor:'pointer' }}>Cancel</button>
                <button onClick={saveSurveyor} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
