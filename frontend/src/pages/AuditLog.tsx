import { useEffect, useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'

interface AuditLog {
  id: number
  user_id: number
  action: string
  resource: string
  status: string
  detail: string
  timestamp: string
}

function AuditLog() {
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit/')
        setLogs(res.data)
      } catch (err) {
        toast.error('Failed to fetch audit logs')
      }
    }
    fetchLogs()
  }, [])

  const statusColor = (status: string) => {
    return status === 'success'
      ? { bg: '#d1fae5', color: '#10b981' }
      : { bg: '#fee2e2', color: '#ef4444' }
  }

  const actionColor = (action: string) => {
    if (action === 'CREATE') return '#7c3aed'
    if (action === 'DELETE') return '#ef4444'
    if (action === 'UPDATE') return '#f59e0b'
    if (action === 'READ') return '#3b82f6'
    return '#666'
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <ClipboardList size={24} color="#7c3aed" />
        <h1 style={{ margin: 0 }}>Audit Log</h1>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Time</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>User</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Action</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Resource</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No logs yet</td>
              </tr>
            )}
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px', color: '#666', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: '14px' }}>User #{log.user_id}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ fontWeight: 'bold', color: actionColor(log.action) }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '14px', color: '#666' }}>{log.resource}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: statusColor(log.status).bg, color: statusColor(log.status).color }}>
                    {log.status}
                  </span>
                </td>
                <td style={{ padding: '14px', color: '#666' }}>{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditLog