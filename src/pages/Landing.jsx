import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl font-bold text-orange-500 mb-4">HabitLoop 🔁</h1>
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        Build habits that stick. Track your streaks, stay consistent, and grow a little every day.
      </p>
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-white border-2 border-orange-300 text-orange-500 font-bold px-6 py-3 rounded-xl hover:bg-orange-100 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Landing;