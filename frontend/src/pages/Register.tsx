import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api'
import { Shield } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '', organization: '', role: 'viewer' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e2e' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
          <Shield size={32} color="#7c3aed" />
          <h1 style={{ margin: 0, fontSize: '24px' }}>AccessGuard</h1>
        </div>

        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Register</h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
        <input
          type="text"
          placeholder="Organization (e.g. Acme Corp)"
          value={form.organization}
          onChange={e => setForm({ ...form, organization: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />

        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        >
          <option value="viewer">Viewer</option>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#7c3aed' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register