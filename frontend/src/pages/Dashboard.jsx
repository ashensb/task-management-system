import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../services/api';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import { Plus, Search, Trash2, Edit3, CheckCircle2, Clock, AlertTriangle, ListTodo, Loader2 } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [search, statusFilter, priorityFilter, sortBy]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks', {
        params: { search, status: statusFilter, priority: priorityFilter, sortBy },
      });
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get('/tasks/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await API.put(`/tasks/${selectedTask.id}`, taskData);
        toast.success('Task updated successfully!');
      } else {
        await API.post('/tasks', taskData);
        toast.success('Task created successfully!');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        toast.success('Task deleted successfully!');
        fetchTasks();
        fetchStats();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleLogoutClick = () => {
    toast.success('Logged out successfully');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={handleLogoutClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalTasks || 0}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><ListTodo className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.pendingTasks || 0}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.inProgressTasks || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.completedTasks || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2 md:col-span-1">
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.overdueTasks || 0}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Action & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <select
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="due_date">Due Date</option>
            </select>

            <button
              onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition shadow-md shadow-indigo-100"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Task Cards Section / Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ListTodo className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No tasks found</h3>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' :
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                      task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{task.title}</h4>
                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{task.description || 'No description provided.'}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={selectedTask}
      />
    </div>
  );
};

export default Dashboard;