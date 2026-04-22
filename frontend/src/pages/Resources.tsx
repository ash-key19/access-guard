import { useEffect, useState } from 'react'
import api from '../api'
import toast from 'react-hot-toast'
import { Plus, Trash2, Edit2, Lock } from 'lucide-react'

interface Resource {
  id: number
  title: string
  content: string
  min_role: string
  owner_id: number
  created_at: string
}

function Resources() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [resources, setResources] = useState<Resource[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', content: '', min_role: 'viewer' })

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources/')
      setResources(res.data)
    } catch (err) {
      toast.error('Failed to fetch resources')
    }
  }

  useEffect(() => { fetchResources() }, [])

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.patch(`/resources/${editingId}`, form)
        toast.success('Resource updated!')
      } else {
        await api.post('/resources/', form)
        toast.success('Resource created!')
      }
      setForm({ title: '', content: '', min_role: 'viewer' })
      setShowForm(false)
      setEditingId(null)
      fetchResources()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Action failed')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/resources/${id}`)
      toast.success('Resource deleted!')
      fetchResources()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Delete failed')
    }
  }

  const handleEdit = (r: Resource) => {
    setForm({ title: r.title, content: r.content, min_role: r.min_role })
    setEditingId(r.id)
    setShowForm(true)
  }

  const roleColor = (role: string) => {
    if (role === 'admin') return '#ef4444'
    if (role === 'member') return '#f59e0b'
    return '#10b981'
  }

  const inputStyle = {
    width: '100%', padding: '10px', marginBottom: '12px',
    borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' as const
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Resources</h1>
        {['admin', 'member'].includes(user.role) && (
          <button
            onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', content: '', min_role: 'viewer' }) }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <Plus size={18} /> New Resource
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Resource' : 'Create Resource'}</h3>
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
          <textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
            style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
          <select value={form.min_role} onChange={e => setForm({ ...form, min_role: e.target.value })} style={inputStyle}>
            <option value="viewer">Viewer (everyone can see)</option>
            <option value="member">Member+ only</option>
            <option value="admin">Admin only</option>
          </select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSubmit}
              style={{ padding: '10px 20px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              {editingId ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {resources.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No resources yet. Create one!</div>
        )}
        {resources.map(r => (
          <div key={r.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0 }}>{r.title}</h3>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '3px 8px', borderRadius: '20px', background: roleColor(r.min_role) + '20', color: roleColor(r.min_role) }}>
                    <Lock size={12} /> {r.min_role}
                  </span>
                </div>
                <p style={{ color: '#666', margin: 0 }}>{r.content}</p>
              </div>
              {['admin', 'member'].includes(user.role) && (
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button onClick={() => handleEdit(r)}
                    style={{ padding: '8px', background: '#ede9fe', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <Edit2 size={16} color="#7c3aed" />
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    style={{ padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Resources