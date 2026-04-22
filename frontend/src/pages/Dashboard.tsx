import { useEffect, useState } from 'react'
import api from '../api'
import { Shield, FileText, Users, ClipboardList } from 'lucide-react'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [stats, setStats] = useState({ resources: 0, users: 0, logs: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resourcesRes = await api.get('/resources/')
        setStats(prev => ({ ...prev, resources: resourcesRes.data.length }))

        if (user.role === 'admin') {
          const usersRes = await api.get('/users/')
          const logsRes = await api.get('/audit/')
          setStats({ resources: resourcesRes.data.length, users: usersRes.data.length, logs: logsRes.data.length })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [])

  const cardStyle = {
    background: 'white', borderRadius: '12px', padding: '24px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }

  return (
    <div>
      <h1 style={{ marginBottom: '8px' }}>Welcome, {user.username} 👋</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Organization: <strong>{user.organization}</strong> | Role: <strong style={{ color: '#7c3aed' }}>{user.role}</strong>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <div style={{ background: '#ede9fe', borderRadius: '10px', padding: '12px' }}>
            <FileText size={24} color="#7c3aed" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.resources}</div>
            <div style={{ color: '#666', fontSize: '14px' }}>Resources</div>
          </div>
        </div>

        {user.role === 'admin' && (
          <>
            <div style={cardStyle}>
              <div style={{ background: '#ede9fe', borderRadius: '10px', padding: '12px' }}>
                <Users size={24} color="#7c3aed" />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.users}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>Users</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ background: '#ede9fe', borderRadius: '10px', padding: '12px' }}>
                <ClipboardList size={24} color="#7c3aed" />
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.logs}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>Audit Logs</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '40px', background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} color="#7c3aed" />
          <h3 style={{ margin: 0 }}>Role Permissions</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Permission</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Viewer</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Member</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['View Resources', '✅', '✅', '✅'],
              ['Create Resources', '❌', '✅', '✅'],
              ['Edit Resources', '❌', '✅', '✅'],
              ['Delete Resources', '❌', '✅', '✅'],
              ['Manage Users', '❌', '❌', '✅'],
              ['View Audit Logs', '❌', '❌', '✅'],
            ].map(([perm, ...roles]) => (
              <tr key={perm} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px' }}>{perm}</td>
                {roles.map((r, i) => <td key={i} style={{ padding: '10px', textAlign: 'center' }}>{r}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard