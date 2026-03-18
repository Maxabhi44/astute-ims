import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const NAV = [
  { href:'/dashboard', icon:'◉', label:'Dashboard' },
  { href:'/claims', icon:'📋', label:'Claims' },
  { href:'/surveyors', icon:'👤', label:'Surveyors' },
  { href:'/documents', icon:'📁', label:'Documents' },
  { href:'/reports', icon:'📊', label:'Reports' },
  { href:'/followups', icon:'🔔', label:'Follow-ups' },
  { href:'/emails', icon:'✉️', label:'Email Log' },
]

export default function Layout({ children, active, user }: { children: React.ReactNode; active?: string; user?: any }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f8f9fc', fontFamily:'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, minWidth: 220, background:'white',
        borderRight:'1px solid #e5e7eb',
        display:'flex', flexDirection:'column',
        position:'sticky', top:0, height:'100vh', overflow:'auto'
      }}>
        {/* Logo */}
        <div style={{ padding:'20px 18px', borderBottom:'1px solid #e5e7eb' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'linear-gradient(135deg,#667eea,#764ba2)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:18
            }}>🛡️</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#1a1a2e', lineHeight:1.2 }}>Astute IMS</div>
              <div style={{ fontSize:11, color:'#9ca3af' }}>Backend Executive</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:'10px 10px', flex:1 }}>
          {NAV.map(item => {
            const isActive = active === item.label.toLowerCase() || router.pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration:'none' }}>
                <div style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'9px 12px', borderRadius:8, marginBottom:2,
                  background: isActive ? '#f0f4ff' : 'transparent',
                  color: isActive ? '#3b5bdb' : '#6b7280',
                  fontWeight: isActive ? 600 : 400,
                  fontSize:13, cursor:'pointer', transition:'all 0.15s',
                  borderLeft: isActive ? '3px solid #3b5bdb' : '3px solid transparent',
                }}>
                  <span style={{ fontSize:15 }}>{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User & Signout */}
        <div style={{ padding:'14px 16px', borderTop:'1px solid #e5e7eb' }}>
          <div style={{ fontSize:12, color:'#9ca3af', marginBottom:4 }}>Logged in as</div>
          <div style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', marginBottom:10, wordBreak:'break-all' }}>
            {user?.email || 'Backend Executive'}
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width:'100%', padding:'8px', fontSize:13, fontWeight:500,
              background:'transparent', border:'1px solid #e5e7eb', borderRadius:6,
              color:'#6b7280', cursor:'pointer', transition:'all 0.15s'
            }}
          >
            {signingOut ? '...' : '🚪 Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex:1, overflow:'auto' }}>
        {/* Top bar */}
        <div style={{
          background:'white', borderBottom:'1px solid #e5e7eb',
          padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center',
          position:'sticky', top:0, zIndex:10
        }}>
          <div style={{ fontSize:13, color:'#6b7280' }}>
            📅 {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:8, height:8, borderRadius:'50%', background:'#22c55e',
              boxShadow:'0 0 0 2px rgba(34,197,94,0.2)'
            }}/>
            <span style={{ fontSize:13, color:'#374151', fontWeight:500 }}>System Online</span>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding:'24px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
