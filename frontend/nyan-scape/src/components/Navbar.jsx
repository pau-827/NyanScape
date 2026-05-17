import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import nyanLogo from '../assets/logo.png'

function Navbar({ session }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={nyanLogo} alt="NyanScape logo" />
        NyanScape
      </Link>
      <div className="navbar-links">
        {session ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar