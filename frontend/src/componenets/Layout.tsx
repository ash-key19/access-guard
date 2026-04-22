import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Shield, Users, FileText, ClipboardList, LogOut } from 'lucide-react'

function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#1e1e2e', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <Shield size={24} color="#7c3aed" />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>AccessGuard</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <NavLink to="/dashboard" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px', borderRadius: '8px', textDecoration: 'none',
            color: isActive ? 'white' : '#aaa', background: isActive ? '#7c3aed' : 'transparent'
          })}>
            <Shield size={18} /> Dashboard
          </NavLink>

          <NavLink to="/resources" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px', borderRadius: '8px', textDecoration: 'none',
            color: isActive ? 'white' : '#aaa', background: isActive ? '#7c3aed' : 'transparent'
          })}>
            <FileText size={18} /> Resources
          </NavLink>

          {user.role === 'admin' && (
            <>
              <NavLink to="/users" style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px', borderRadius: '8px', textDecoration: 'none',
                color: isActive ? 'white' : '#aaa', background: isActive ? '#7c3aed' : 'transparent'
              })}>
                <Users size={18} /> Users
              </NavLink>

              <NavLink to="/audit" style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px', borderRadius: '8px', textDecoration: 'none',
                color: isActive ? 'white' : '#aaa', background: isActive ? '#7c3aed' : 'transparent'
              })}>
                <ClipboardList size={18} /> Audit Log
              </NavLink>
            </>
          )}
        </nav>

        {/* User info + logout */}
        <div style={{ borderTop: '1px solid #333', paddingTop: '15px' }}>
          <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '5px' }}>{user.username}</div>
          <div style={{ fontSize: '12px', color: '#7c3aed', marginBottom: '10px' }}>{user.role}</div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '14px'
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '30px', background: '#f5f5f5', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout