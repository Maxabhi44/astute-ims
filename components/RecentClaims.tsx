import Link from 'next/link'

const RECENT_CLAIMS = [
  { id:'CLM-2606', name:'Deepa Nair', type:'Engineering', status:'pending', amount:65000, date:'10 Mar' },
  { id:'CLM-2605', name:'Vijay Sharma', type:'Marine', status:'closed', amount:380000, date:'15 Feb' },
  { id:'CLM-2604', name:'Anita Singh', type:'Burglary', status:'approved', amount:120000, date:'20 Feb' },
  { id:'CLM-2603', name:'Suresh Patel', type:'Health', status:'pending', amount:45000, date:'08 Mar' },
  { id:'CLM-2602', name:'Priya Mehta', type:'Motor', status:'report_submitted', amount:85000, date:'05 Mar' },
]

const STATUS_COLORS: Record<string, [string,string]> = {
  pending: ['#856404','#fff3cd'],
  under_survey: ['#084298','#cfe2ff'],
  report_submitted: ['#0c5460','#d1ecf1'],
  approved: ['#155724','#d4edda'],
  closed: ['#383d41','#e2e3e5'],
}

export function RecentClaims() {
  return (
    <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb', overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e7eb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontWeight:600, fontSize:15 }}>Recent Claims</span>
        <Link href="/claims" style={{ fontSize:12, color:'#3b5bdb', textDecoration:'none', fontWeight:500 }}>View all →</Link>
      </div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ borderBottom:'1px solid #f3f4f6' }}>
            {['Claim ID','Insured','Type','Status','Amount','Date'].map(h => (
              <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontWeight:500, color:'#9ca3af', fontSize:12, background:'#fafafa' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECENT_CLAIMS.map(c => {
            const [color, bg] = STATUS_COLORS[c.status] || ['#383d41','#e2e3e5']
            return (
              <tr key={c.id} style={{ borderBottom:'1px solid #f9fafb' }}>
                <td style={{ padding:'11px 16px', fontWeight:600, color:'#3b5bdb' }}>{c.id}</td>
                <td style={{ padding:'11px 16px', fontWeight:500 }}>{c.name}</td>
                <td style={{ padding:'11px 16px', color:'#6b7280' }}>{c.type}</td>
                <td style={{ padding:'11px 16px' }}>
                  <span style={{ padding:'2px 8px', borderRadius:20, fontSize:11, fontWeight:600, background:bg, color }}>{c.status.replace('_',' ')}</span>
                </td>
                <td style={{ padding:'11px 16px', fontWeight:600 }}>₹{c.amount.toLocaleString('en-IN')}</td>
                <td style={{ padding:'11px 16px', color:'#9ca3af', fontSize:12 }}>{c.date}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RecentClaims

export function ActivityFeed() {
  const items = [
    { icon:'📋', title:'CLM-2606 created', desc:'Deepa Nair — Engineering', time:'2h ago', color:'#3b5bdb' },
    { icon:'📊', title:'Survey report received', desc:'CLM-2602 — Priya Sharma', time:'5h ago', color:'#059669' },
    { icon:'✅', title:'CLM-2605 settled', desc:'₹3,80,000 disbursed', time:'Yesterday', color:'#059669' },
    { icon:'🔔', title:'Follow-up sent', desc:'Email to Suresh Patel', time:'Yesterday', color:'#d97706' },
    { icon:'👤', title:'Surveyor assigned', desc:'Amit Verma — CLM-2603', time:'2 days ago', color:'#7c3aed' },
  ]
  return (
    <div style={{ background:'white', borderRadius:12, border:'1px solid #e5e7eb' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e7eb' }}>
        <span style={{ fontWeight:600, fontSize:15 }}>Activity Feed</span>
      </div>
      <div style={{ padding:'8px 0' }}>
        {items.map((a, i) => (
          <div key={i} style={{ display:'flex', gap:12, padding:'10px 20px', borderBottom: i<items.length-1 ? '1px solid #f9fafb':'none' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500, color:'#1a1a2e' }}>{a.title}</div>
              <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>{a.desc}</div>
            </div>
            <div style={{ fontSize:11, color:'#c4c9d4', whiteSpace:'nowrap' }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuickActions() {
  const actions = [
    { icon:'📋', label:'New Claim', href:'/claims', color:'#3b5bdb' },
    { icon:'📊', label:'Generate Report', href:'/reports', color:'#7c3aed' },
    { icon:'🔔', label:'Add Follow-up', href:'/followups', color:'#d97706' },
    { icon:'✉️', label:'Log Email', href:'/emails', color:'#059669' },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:20 }}>
      {actions.map(a => (
        <Link key={a.href} href={a.href} style={{ textDecoration:'none' }}>
          <div style={{
            background:'white', borderRadius:10, padding:'14px 16px',
            border:`1px solid #e5e7eb`, display:'flex', alignItems:'center', gap:10,
            cursor:'pointer', transition:'all 0.15s'
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}08` }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLDivElement).style.background = 'white' }}
          >
            <span style={{ fontSize:20 }}>{a.icon}</span>
            <span style={{ fontSize:13, fontWeight:500, color:'#374151' }}>{a.label}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
