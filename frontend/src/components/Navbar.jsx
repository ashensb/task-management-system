import React from 'react';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Navbar = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin User' };

  return (
    <nav className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TaskMaster
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-300 text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="font-medium">{user.name}</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition duration-200 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;