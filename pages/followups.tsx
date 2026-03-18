import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

const INIT = [
  { id:'1', claim:'CLM-2601', contact:'Ramesh Gupta', type:'Call', due:'2026-03-18', notes:'Confirm surveyor site visit date', done:false, priority:'high' },
  { id:'2', claim:'CLM-2603', contact:'Suresh Patel', type:'Email', due:'2026-03-19', notes:'Send document checklist for health claim', done:false, priority:'normal' },
  { id:'3', claim:'CLM-2606', contact:'HDFC ERGO', type:'Email', due:'2026-03-20', notes:'Follow up on document receipt confirmation', done:false, priority:'normal' },
  { id:'4', claim:'CLM-2602', contact:'Priya Sharma', type:'Call', due:'2026-03-22', notes:'Confirm report submission timeline', done:true, priority:'normal' },
  { id:'5', claim:'CLM-2604', contact:'Bajaj Allianz', type:'Letter', due:'2026-03-25', notes:'Send final settlement letter', done:false, priority:'high' },
]

export default function FollowupsPage() {
  const router = useRouter()
  const [items, setItems] = useState(INIT)
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState<'pending'|'done'>('pending')
  const [form, setForm] = useState({ claim:'', contact:'', type:'Call', due:'', notes:'', priority:'normal' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data:{session} }) => {
      if (!session) router.push('/')
    })
  }, [])

  const filtered = items.filter(i => tab === 'pending' ? !i.done : i.done)

  function toggle(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  function save() {
    if (!form.claim || !form.contact) return alert('Claim ID and contact required')
    setItems(prev => [...prev, { ...form, id: String(Date.now()), done: false }])
    setShowModal(false)
    setForm({ claim:'', contact:'', type:'Call', due:'', notes:'', priority:'normal' })
  }

  const inputStyle = {
    width:'100%', padding:'9px 12px', fontSize:13,
    border:'1.5px solid #e5e7eb', borderRadius:8,
    outline:'none', color:'#1a1a2e', background:'#fafafa', fontFamily:'inherit'
  }

  const typeIcon: Record<string,string> = { Call:'📞', Email:'✉️', Visit:'🚗', Letter:'📬' }
  const priorityColor: Record<string,[string,string]> = {
    high: ['#856404','#fff3cd'],
    urgent: ['#721c24','#f8d7da'],
    normal: ['#383d41','#e2e3e5'],
  }

  const pendingCount = items.filter(i=>!i.done).length
  const doneCount = items.filter(i=>i.done).length

  return (
    <>
      <Head><title>Follow-ups — Astute IMS</title></Head>
      <Layout active="follow-ups">
        <div className="animate-in">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:700, color:'#1a1a2e', margin:0 }}>Follow-up Tracker</h1>
              <p style={{ color:'#6b7280', fontSize:13, marginTop:3 }}>{pendingCount} pending · {doneCount} completed</p>
            </div>
            <button onClick={()=>setShowModal(true)} style={{
              padding:'10px 20px', background:'linear-gradient(135deg,#667eea,#764ba2)',
              color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer'
            }}>+ Add Reminder</button>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, borderBottom:'1px solid #e5e7eb', marginBottom:16 }}>
            {([['pending','⏳ Pending',pendingCount],['done','✅ Completed',doneCount]] as any[]).map(([key,label,count]) => (
              <button key={key} onClick={()=>setTab(key)} style={{
                padding:'10px 18px', fontSize:13, fontWeight: tab===key ? 600 : 400,
                color: tab===key ? '#3b5bdb' : '#6b7280',
                borderBottom: tab===key ? '2px solid #3b5bdb' : '2px solid transparent',
                background:'none', border:'none', borderBottom: tab===key ? '2px solid #3b5bdb' : '2px solid transparent',
                cursor:'pointer', marginBottom:-1
              }}>{label} <span style={{ marginLeft:6, background: tab===key?'#e0e7ff':'#f3f4f6', color: tab===key?'#3b5bdb':'#9ca3af', padding:'1px 7px', borderRadius:20, fontSize:11, fontWeight:600 }}>{count}</span></button>
            ))}
          </div>

          <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
            {filtered.length === 0 && (
              <div style={{ padding:'40px', textAlign:'center', color:'#9ca3af' }}>
                <div style={{ fontSize:40, marginBottom:8 }}>{tab==='pending'?'🎉':'📋'}</div>
                <p>{tab==='pending' ? 'No pending follow-ups!' : 'No completed items yet'}</p>
              </div>
            )}
            {filtered.map((item, i) => {
              const [pc, pb] = priorityColor[item.priority] || priorityColor.normal
              const isOverdue = !item.done && new Date(item.due) < new Date()
              return (
                <div key={item.id} style={{
                  display:'flex', gap:14, padding:'16px 20px',
                  borderBottom: i<filtered.length-1 ? '1px solid #f3f4f6':undefined,
                  opacity: item.done ? 0.55 : 1,
                  background: isOverdue ? '#fff9f9' : 'white',
                  transition:'all 0.15s'
                }}>
                  <input type="checkbox" checked={item.done} onChange={()=>toggle(item.id)}
                    style={{ marginTop:3, width:16, height:16, cursor:'pointer', accentColor:'#3b5bdb' }} />
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:600, fontSize:14, color:'#3b5bdb', textDecoration:item.done?'line-through':undefined }}>{item.claim}</span>
                      <span style={{ fontSize:13, color:'#374151', fontWeight:500, textDecoration:item.done?'line-through':undefined }}>— {item.contact}</span>
                      <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:600, background:pb, color:pc }}>{item.priority}</span>
                      {isOverdue && <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:600, background:'#fef2f2', color:'#991b1b' }}>⚠️ Overdue</span>}
                    </div>
                    <div style={{ fontSize:13, color:'#6b7280', marginBottom:6, textDecoration:item.done?'line-through':undefined }}>{item.notes}</div>
                    <div style={{ display:'flex', gap:12, fontSize:12, color:'#9ca3af' }}>
                      <span>{typeIcon[item.type] || '📌'} {item.type}</span>
                      <span>📅 Due: {item.due}</span>
                    </div>
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
                <h2 style={{ fontSize:17, fontWeight:700, margin:0 }}>Add Follow-up Reminder</h2>
                <button onClick={()=>setShowModal(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#6b7280' }}>×</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { label:'Claim ID *', key:'claim', placeholder:'CLM-2601' },
                  { label:'Contact Person *', key:'contact', placeholder:'Name or company' },
                ].map(f=>(
                  <div key={f.key}>
                    <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>{f.label}</label>
                    <input placeholder={f.placeholder} value={(form as any)[f.key]}
                      onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Type</label>
                  <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={inputStyle}>
                    {['Call','Email','Visit','Letter'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Due Date</label>
                  <input type="date" value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Priority</label>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} style={inputStyle}>
                    {['normal','high','urgent'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#374151', marginBottom:5 }}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                  placeholder="What needs to be followed up..." rows={3}
                  style={{ ...inputStyle, resize:'vertical' }} />
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                <button onClick={()=>setShowModal(false)} style={{ padding:'10px 20px', border:'1px solid #e5e7eb', borderRadius:8, background:'white', fontSize:14, cursor:'pointer' }}>Cancel</button>
                <button onClick={save} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}
