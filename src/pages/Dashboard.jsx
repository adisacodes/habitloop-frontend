import { useEffect, useState } from 'react';
import { getHabits, createHabit } from '../api/habits';

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

  return (
    <div>
      <h2>Your Habits</h2>
      <form onSubmit={handleAddHabit}>
        <input
          placeholder="New habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Habit</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>
            {habit.name} — {habit.frequency}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;