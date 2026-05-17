import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import nyanLogo from '../assets/logo.png'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img src={nyanLogo} alt="NyanScape logo" />
          NyanScape
        </Link>
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      {/* Auth Split */}
      <div className="auth-split" style={{ flex: 1 }}>
        <div className="auth-left">
          <svg className="auth-left-bg" viewBox="0 0 700 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <rect width="700" height="800" fill="#7c3aed"/>
            <path d="M0,200 C150,100 300,300 500,150 C600,80 680,200 700,180 L700,0 L0,0 Z" fill="#6d28d9" opacity="0.7"/>
            <path d="M0,800 C100,700 250,750 400,680 C520,620 650,700 700,750 L700,800 Z" fill="#5b21b6" opacity="0.8"/>
            <path d="M0,500 C80,450 200,520 320,480 C440,440 560,500 700,460 L700,800 L0,800 Z" fill="#4c1d95" opacity="0.5"/>
            <circle cx="580" cy="120" r="80" fill="#8b5cf6" opacity="0.3"/>
            <circle cx="100" cy="650" r="120" fill="#6d28d9" opacity="0.3"/>
            <circle cx="400" cy="350" r="60" fill="#a78bfa" opacity="0.15"/>
          </svg>
          <div className="auth-left-content">
            <h1>Welcome to<br/><span>NyanScape.</span></h1>
            <p>Your cozy corner of the internet for all things cats. Share moments, spread joy, and connect with fellow cat lovers.</p>
            <div className="auth-features">
              <div className="auth-feature">📸 Share your cat photos</div>
              <div className="auth-feature">❤️ Like and comment on posts</div>
              <div className="auth-feature">🌍 Join a community of cat lovers</div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2><span>Sign in</span> to your<br/>account</h2>
            <p className="auth-subtitle">Don't have an account? <Link to="/register">Register here</Link></p>
            {error && <div className="error">{error}</div>}
            <div className="form">
              <div className="input-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        🐱 <span>NyanScape</span> — Made with love for cat lovers everywhere · {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default Login
