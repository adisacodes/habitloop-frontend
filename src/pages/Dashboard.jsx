import { useEffect, useState } from 'react';
import { getHabits, createHabit, logHabit } from '../api/habits';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      setError('Failed to load habits: ' + JSON.stringify(err.response?.data));
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      await createHabit({ name, frequency: 'daily' });
      setName('');
      loadHabits();
    } catch (err) {
      setError('Failed to create habit: ' + JSON.stringify(err.response?.data));
    }
  };

  const handleMarkDone = async (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await logHabit(habitId, today);
      loadHabits();
    } catch (err) {
      setError('Failed to log habit: ' + JSON.stringify(err.response?.data));
    }
  };

  const emojis = ['🔥', '💧', '📚', '🏃', '🧘', '🎯', '✨', '🌱'];

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <h2 className="text-4xl font-bold text-orange-500 mb-6 text-center">Your Habits ✨</h2>

      <form onSubmit={handleAddHabit} className="flex gap-2 max-w-md mx-auto mb-8">
        <input
          placeholder="New habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400 bg-white"
        />
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 rounded-xl transition"
        >
          Add
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid gap-4 max-w-md mx-auto">
        {habits.map((habit, i) => {
          const today = new Date().toISOString().split('T')[0];
          const doneToday = habit.logs?.some((log) => log.date === today && log.completed);

          return (
            <div
              key={habit.id}
              className="bg-white rounded-2xl shadow p-4 flex items-center justify-between border-2 border-orange-100 hover:border-orange-300 transition"
            >
              <div>
                <span className="font-semibold text-gray-700">
                  {emojis[i % emojis.length]} {habit.name}
                </span>
                <div className="text-sm text-orange-400 bg-orange-100 inline-block px-3 py-1 rounded-full ml-2">
                  {habit.frequency}
                </div>
              </div>
              <button
                onClick={() => handleMarkDone(habit.id)}
                disabled={doneToday}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  doneToday
                    ? 'bg-green-100 text-green-500 cursor-not-allowed'
                    : 'bg-orange-400 hover:bg-orange-500 text-white'
                }`}
              >
                {doneToday ? '✅ Done' : 'Mark Done'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;