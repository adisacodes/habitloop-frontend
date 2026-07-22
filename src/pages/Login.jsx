import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      navigate('/dashboard');
    } catch (error) {
      setMessage('Login failed: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm border-4 border-orange-200">
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">Welcome back! 👋</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-orange-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-orange-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400"
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 rounded-xl transition"
          >
            Login
          </button>
        </form>
        {message && <p className="text-red-500 text-sm mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default Login;