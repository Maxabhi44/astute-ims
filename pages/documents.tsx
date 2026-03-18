import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

const DOCS = [
  { id:'1', name:'Survey Report - CLM-2601.pdf', claim:'CLM-2601', type:'survey', date:'2026-03-12', size:'2.4 MB', uploader:'Rajesh Kumar' },
  { id:'2', name:'Fire Damage Photos - CLM-2601.zip', claim:'CLM-2601', type:'claim', date:'2026-03-10', size:'8.1 MB', uploader:'Ramesh Gupta' },
  { id:'3', name:'Policy Copy - POL-1892.pdf', claim:'CLM-2602', type:'policy', date:'2026-03-05', size:'1.2 MB', uploader:'Priya Mehta' },
  { id:'4', name:'Motor Survey Estimate - CLM-2602.pdf', claim:'CLM-2602', type:'survey', date:'2026-03-08', size:'3.6 MB', uploader:'Priya Sharma' },
  { id:'5', name:'Hospital Bills - CLM-2603.pdf', claim:'CLM-2603', type:'claim', date:'2026-03-09', size:'5.2 MB', uploader:'Suresh Patel' },
  { id:'6', name:'Policy Document - POL-3301.pdf', claim:'CLM-2603', type:'policy', date:'2026-02-25', size:'0.9 MB', uploader:'Suresh Patel' },
  { id:'7', name:'Final Settlement Letter - CLM-2604.pdf', claim:'CLM-2604', type:'settlement', date:'2026-03-14', size:'0.5 MB', uploader:'Admin' },
  { id:'8', name:'Marine Cargo Survey - CLM-2605.pdf', claim:'CLM-2605', type:'survey', date:'2026-02-20', size:'4.8 MB', uploader:'Rajesh Kumar' },
]

const TYPE_MAP: Record<string,{ icon:string; color:string; bg:string; label:string }> = {
  survey: { icon:'📊', color:'#084298', bg:'#cfe2ff', label:'Survey Report' },
  policy: { icon:'📄', color:'#155724', bg:'#d4edda', label:'Policy Doc' },
  claim: { icon:'📋', color:'#856404', bg:'#fff3cd', label:'Claim Form' },
  settlement: { icon:'✅', color:'#383d41', bg:'#e2e3e5', label:'Settlement' },
}

export default function DocumentsPage() {
  const router = useRouter()
  const [docs, setDocs] = useState(DOCS)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data:{session} }) => {
      if (!session) router.push('/')
    })
  }, [])

  const filtered = docs.filter(d => {
    const q = search.toLowerCase()
    const matchQ = !q || d.name.toLowerCase().includes(q) || d.claim.toLowerCase().includes(q)
    const matchF = !filter || d.type === filter
    return matchQ && matchF
  })

  const inputStyle = {
    padding:'9px 12px', fontSize:13,
    border:'1.5px solid #e5e7eb', borderRadius:8,
    outline:'none', color:'#1a1a2e', background:'#fafafa', fontFamily:'inherit'
  }

  const totalSize = docs.reduce((a,d) => a + parseFloat(d.size), 0)

  return (
    <>
      <Head><title>Documents — Astute IMS</title></Head>
      <Layout active="documents">
        <div className="animate-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 }}>Document Management</h1>
              <p style={{ color:'#6b7280', fontSize:13, marginTop:3 }}>{docs.length} files · {totalSize.toFixed(1)} MB total</p>
            </div>
            <button style={{
              padding:'10px 20px', background:'linear-gradient(135deg,#667eea,#764ba2)',
              color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer'
            }}>+ Upload Document</button>
          </div>

          {/* Type filter buttons */}
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
            {[['','All Files'],['survey','Survey Reports'],['policy','Policy Docs'],['claim','Claim Forms'],['settlement','Settlements']].map(([key,label])=>(
              <button key={key} onClick={()=>setFilter(key)} style={{
                padding:'7px 14px', fontSize:13, fontWeight:500,
                borderRadius:20, border: filter===key ? '2px solid #3b5bdb' : '1px solid #e5e7eb',
                background: filter===key ? '#f0f4ff' : 'white',
                color: filter===key ? '#3b5bdb' : '#6b7280',
                cursor:'pointer', transition:'all 0.15s'
              }}>{label}</button>
            ))}
            <input placeholder="🔍 Search documents..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ ...inputStyle, marginLeft:'auto', width:220 }} />
          </div>

          {/* Stats row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
            {Object.entries(TYPE_MAP).map(([key,val])=>(
              <div key={key} style={{ background:'white', borderRadius:10, padding:'12px 14px', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>{val.icon}</span>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#1a1a2e' }}>{docs.filter(d=>d.type===key).length}</div>
                  <div style={{ fontSize:11, color:'#9ca3af' }}>{val.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Document list */}
          <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
            {filtered.map((doc, i) => {
              const t = TYPE_MAP[doc.type] || TYPE_MAP.claim
              return (
                <div key={doc.id} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'14px 20px',
                  borderBottom: i<filtered.length-1 ? '1px solid #f3f4f6' : undefined,
                  transition:'background 0.1s', cursor:'pointer'
                }}
                  onMouseEnter={e=>(e.currentTarget.style.background='#f9fafb')}
                  onMouseLeave={e=>(e.currentTarget.style.background='white')}
                >
                  <div style={{ width:40, height:40, borderRadius:10, background:t.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {t.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'#1a1a2e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{doc.name}</div>
                    <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>
                      {doc.claim} · Uploaded by {doc.uploader} · {doc.date}
                    </div>
                  </div>
                  <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:t.bg, color:t.color, flexShrink:0 }}>{t.label}</span>
                  <span style={{ fontSize:12, color:'#9ca3af', minWidth:52, textAlign:'right', flexShrink:0 }}>{doc.size}</span>
                  <button style={{ padding:'6px 12px', fontSize:12, border:'1px solid #e5e7eb', borderRadius:6, background:'white', cursor:'pointer', color:'#374151', flexShrink:0 }}>⬇ Download</button>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div style={{ padding:'40px', textAlign:'center', color:'#9ca3af' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📁</div>
                <p>No documents found</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}
