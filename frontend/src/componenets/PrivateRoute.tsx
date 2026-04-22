import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return <>{children}</>
}

export default PrivateRoute