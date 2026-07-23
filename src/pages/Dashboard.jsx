import { useEffect, useState } from 'react';
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabit,
  getCategories,
  createCategory,
  getReminders,
  createReminder,
  deleteReminder,
} from '../api/habits';

function calculateStreaks(logs) {
  if (!logs || logs.length === 0) return { current: 0, longest: 0 };

  const completedDates = logs
    .filter((log) => log.completed)
    .map((log) => log.date)
    .sort();

  let longest = 0;
  let current = 0;
  let streak = 0;
  let prevDate = null;

  for (const dateStr of completedDates) {
    const date = new Date(dateStr);
    if (prevDate) {
      const diffDays = (date - prevDate) / (1000 * 60 * 60 * 24);
      streak = diffDays === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    longest = Math.max(longest, streak);
    prevDate = date;
  }

  const today = new Date().toISOString().split('T')[0];
  const lastDate = completedDates[completedDates.length - 1];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  current = (lastDate === today || lastDate === yesterdayStr) ? streak : 0;

  return { current, longest };
}

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [categoryId, setCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [openHistoryId, setOpenHistoryId] = useState(null);
  const [openReminderId, setOpenReminderId] = useState(null);
  const [reminderTime, setReminderTime] = useState('');

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      setError('Failed to load habits: ' + JSON.stringify(err.response?.data));
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories: ' + JSON.stringify(err.response?.data));
    }
  };

  const loadReminders = async () => {
    try {
      const data = await getReminders();
      setReminders(data);
    } catch (err) {
      setError('Failed to load reminders: ' + JSON.stringify(err.response?.data));
    }
  };

  useEffect(() => {
    loadHabits();
    loadCategories();
    loadReminders();
  }, []);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      await createHabit({
        name,
        frequency,
        category: categoryId || null,
      });
      setName('');
      loadHabits();
    } catch (err) {
      setError('Failed to create habit: ' + JSON.stringify(err.response?.data));
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const created = await createCategory(newCategory);
      setNewCategory('');
      setShowNewCategory(false);
      await loadCategories();
      setCategoryId(created.id);
    } catch (err) {
      setError('Failed to create category: ' + JSON.stringify(err.response?.data));
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

  const handleDelete = async (habitId) => {
    if (!window.confirm('Delete this habit? This cannot be undone.')) return;
    try {
      await deleteHabit(habitId);
      loadHabits();
    } catch (err) {
      setError('Failed to delete habit: ' + JSON.stringify(err.response?.data));
    }
  };

  const startEdit = (habit) => {
    setEditingId(habit.id);
    setEditName(habit.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = async (habitId) => {
    try {
      await updateHabit(habitId, { name: editName });
      setEditingId(null);
      setEditName('');
      loadHabits();
    } catch (err) {
      setError('Failed to update habit: ' + JSON.stringify(err.response?.data));
    }
  };

  const toggleHistory = (habitId) => {
    setOpenHistoryId(openHistoryId === habitId ? null : habitId);
  };

  const toggleReminderPanel = (habitId) => {
    setOpenReminderId(openReminderId === habitId ? null : habitId);
    setReminderTime('');
  };

  const handleAddReminder = async (habitId) => {
    if (!reminderTime) return;
    try {
      await createReminder(habitId, reminderTime);
      setReminderTime('');
      loadReminders();
    } catch (err) {
      setError('Failed to add reminder: ' + JSON.stringify(err.response?.data));
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      await deleteReminder(reminderId);
      loadReminders();
    } catch (err) {
      setError('Failed to delete reminder: ' + JSON.stringify(err.response?.data));
    }
  };

  const emojis = ['🔥', '💧', '📚', '🏃', '🧘', '🎯', '✨', '🌱'];

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : null;
  };

  const getRemindersForHabit = (habitId) => {
    return reminders.filter((r) => r.habit === habitId);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <h2 className="text-4xl font-bold text-orange-500 mb-6 text-center">Your Habits ✨</h2>

      <form onSubmit={handleAddHabit} className="flex flex-col gap-2 max-w-md mx-auto mb-4">
        <div className="flex gap-2">
          <input
            placeholder="New habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-2 focus:outline-none focus:border-orange-400 bg-white"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="border-2 border-orange-200 rounded-xl px-3 py-2 bg-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex-1 border-2 border-orange-200 rounded-xl px-3 py-2 bg-white"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNewCategory(!showNewCategory)}
            className="text-sm text-orange-500 font-semibold hover:underline whitespace-nowrap"
          >
            + New category
          </button>
        </div>

        {showNewCategory && (
          <div className="flex gap-2">
            <input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-2 bg-white"
            />
            <button
              onClick={handleAddCategory}
              className="bg-orange-300 hover:bg-orange-400 text-white font-bold px-4 rounded-xl transition"
            >
              Save
            </button>
          </div>
        )}

        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 rounded-xl transition"
        >
          Add Habit
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {habits.length === 0 ? (
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow p-8 border-2 border-orange-100">
          <p className="text-2xl mb-2">🌱</p>
          <p className="text-gray-500 font-medium">
            You haven't added any habits yet. Start building one above!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-md mx-auto">
          {habits.map((habit, i) => {
            const today = new Date().toISOString().split('T')[0];
            const doneToday = habit.logs?.some((log) => log.date === today && log.completed);
            const { current, longest } = calculateStreaks(habit.logs);
            const catName = getCategoryName(habit.category);
            const isEditing = editingId === habit.id;
            const historyOpen = openHistoryId === habit.id;
            const reminderOpen = openReminderId === habit.id;
            const habitReminders = getRemindersForHabit(habit.id);

            const completedDates = (habit.logs || [])
              .filter((log) => log.completed)
              .map((log) => log.date)
              .sort()
              .reverse();

            return (
              <div
                key={habit.id}
                className="bg-white rounded-2xl shadow p-4 border-2 border-orange-100 hover:border-orange-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex gap-2 mb-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 border-2 border-orange-200 rounded-xl px-3 py-1"
                        />
                        <button
                          onClick={() => saveEdit(habit.id)}
                          className="text-sm bg-green-400 hover:bg-green-500 text-white px-3 rounded-xl font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 rounded-xl font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="font-semibold text-gray-700">
                        {emojis[i % emojis.length]} {habit.name}
                      </span>
                    )}

                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-sm text-orange-400 bg-orange-100 px-3 py-1 rounded-full">
                        {habit.frequency}
                      </span>
                      {catName && (
                        <span className="text-sm text-blue-500 bg-blue-100 px-3 py-1 rounded-full">
                          {catName}
                        </span>
                      )}
                      <span className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                        🔥 {current} streak
                      </span>
                      <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                        🏆 {longest} best
                      </span>
                    </div>

                    {!isEditing && (
                      <div className="flex gap-3 mt-2 flex-wrap">
                        <button
                          onClick={() => startEdit(habit)}
                          className="text-xs text-gray-500 hover:text-orange-500 font-semibold"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(habit.id)}
                          className="text-xs text-gray-500 hover:text-red-500 font-semibold"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => toggleHistory(habit.id)}
                          className="text-xs text-gray-500 hover:text-blue-500 font-semibold"
                        >
                          📅 {historyOpen ? 'Hide History' : 'History'}
                        </button>
                        <button
                          onClick={() => toggleReminderPanel(habit.id)}
                          className="text-xs text-gray-500 hover:text-purple-500 font-semibold"
                        >
                          ⏰ {reminderOpen ? 'Hide Reminders' : 'Reminders'}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleMarkDone(habit.id)}
                    disabled={doneToday}
                    className={`px-4 py-2 rounded-xl font-bold transition ml-2 ${
                      doneToday
                        ? 'bg-green-100 text-green-500 cursor-not-allowed'
                        : 'bg-orange-400 hover:bg-orange-500 text-white'
                    }`}
                  >
                    {doneToday ? '✅ Done' : 'Mark Done'}
                  </button>
                </div>

                {historyOpen && (
                  <div className="mt-3 pt-3 border-t border-orange-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Completion history</p>
                    {completedDates.length === 0 ? (
                      <p className="text-sm text-gray-400">No completions logged yet.</p>
                    ) : (
                      <ul className="text-sm text-gray-600 flex flex-wrap gap-2">
                        {completedDates.map((date) => (
                          <li key={date} className="bg-green-50 text-green-600 px-2 py-1 rounded-lg">
                            {date}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {reminderOpen && (
                  <div className="mt-3 pt-3 border-t border-orange-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Reminders</p>
                    {habitReminders.length > 0 && (
                      <ul className="text-sm text-gray-600 flex flex-col gap-1 mb-2">
                        {habitReminders.map((rem) => (
                          <li
                            key={rem.id}
                            className="flex justify-between items-center bg-purple-50 text-purple-600 px-3 py-1 rounded-lg"
                          >
                            {rem.time}
                            <button
                              onClick={() => handleDeleteReminder(rem.id)}
                              className="text-xs text-red-400 hover:text-red-600 font-bold ml-2"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="border-2 border-orange-200 rounded-xl px-3 py-1 text-sm"
                      />
                      <button
                        onClick={() => handleAddReminder(habit.id)}
                        className="text-sm bg-purple-400 hover:bg-purple-500 text-white px-3 rounded-xl font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;