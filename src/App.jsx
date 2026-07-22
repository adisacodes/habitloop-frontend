import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-center gap-4 py-4 bg-white shadow-sm mb-4">
      {isLoggedIn ? (
        <button onClick={handleLogout} className="text-orange-500 font-semibold hover:underline">
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">Login</Link>
          <Link to="/signup" className="text-orange-500 font-semibold hover:underline">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;