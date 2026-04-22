import { useEffect, useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { UserCheck } from 'lucide-react'

interface User {
  id: number
  email: string
  username: string
  role: string
  organization: string
  is_active: boolean
  created_at: string
}

function Users() {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/')
      setUsers(res.data)
    } catch (err) {
      toast.error('Failed to fetch users')
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.patch(`/users/${userId}/role?role=${newRole}`)
      toast.success('Role updated!')
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to update role')
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      await api.delete(`/users/${userId}`)
      toast.success('User deleted!')
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to delete user')
    }
  }

  const roleColor = (role: string) => {
    if (role === 'admin') return { bg: '#fee2e2', color: '#ef4444' }
    if (role === 'member') return { bg: '#fef3c7', color: '#f59e0b' }
    return { bg: '#d1fae5', color: '#10b981' }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <UserCheck size={24} color="#7c3aed" />
        <h1 style={{ margin: 0 }}>Users — {currentUser.organization}</h1>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '14px', textAlign: 'left' }}>Username</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Joined</th>
              <th style={{ padding: '14px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px', fontWeight: '500' }}>{u.username}</td>
                <td style={{ padding: '14px', color: '#666' }}>{u.email}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: roleColor(u.role).bg, color: roleColor(u.role).color }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '14px', color: '#666' }}>
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px' }}>
                  {u.id !== currentUser.id && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDelete(u.id)}
                        style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {u.id === currentUser.id && <span style={{ color: '#aaa', fontSize: '13px' }}>You</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users