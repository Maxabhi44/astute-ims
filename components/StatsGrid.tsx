interface Stats {
  total: number
  pending: number
  closed: number
  surveyors: number
  totalAmount: number
}

export default function StatsGrid({ stats }: { stats: Stats }) {
  const cards = [
    { label:'Total Claims', value: stats.total, icon:'📋', color:'#3b5bdb', bg:'#f0f4ff', change:'+2 this week' },
    { label:'Pending Action', value: stats.pending, icon:'⏳', color:'#d97706', bg:'#fffbeb', change:'Needs attention', alert:true },
    { label:'Settled Claims', value: stats.closed, icon:'✅', color:'#059669', bg:'#f0fdf4', change:'Successfully closed' },
    { label:'Active Surveyors', value: stats.surveyors, icon:'👤', color:'#7c3aed', bg:'#faf5ff', change:'In field today' },
    { label:'Total Claim Value', value:`₹${(stats.totalAmount/100000).toFixed(1)}L`, icon:'💰', color:'#dc2626', bg:'#fef2f2', change:'All open claims', wide:true },
  ]

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14 }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          background:'white', borderRadius:12, padding:'18px 16px',
          border:'1px solid #e5e7eb',
          gridColumn: (c as any).wide ? 'span 1' : undefined,
          transition:'transform 0.15s, box-shadow 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em' }}>{c.label}</div>
            <div style={{ width:32, height:32, borderRadius:8, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{c.icon}</div>
          </div>
          <div style={{ fontSize:28, fontWeight:700, color:c.color, lineHeight:1 }}>{c.value}</div>
          <div style={{ fontSize:11, color: (c as any).alert ? '#d97706' : '#9ca3af', marginTop:6 }}>{c.change}</div>
        </div>
      ))}
    </div>
  )
}
