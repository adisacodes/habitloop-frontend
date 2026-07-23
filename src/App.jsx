import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const hideNavbarOn = ['/', '/login', '/signup'];
  if (hideNavbarOn.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm mb-4">
      <span className="text-orange-500 font-bold text-lg">HabitLoop 🔁</span>
      {isLoggedIn ? (
        <button onClick={handleLogout} className="text-orange-500 font-semibold hover:underline">
          Logout
        </button>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">Login</Link>
          <Link to="/signup" className="text-orange-500 font-semibold hover:underline">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;