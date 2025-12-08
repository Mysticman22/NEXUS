import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDash = () => {
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeQueries: 0,
    systemHealth: 'Stable',
    pendingApprovals: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // 1. Get Current Admin Info
    if (auth.currentUser) {
      setAdminName(auth.currentUser.displayName);
    }

    // 2. Mock Fetching System Stats (Replace with real API call to your Node backend)
    // e.g., axios.get('http://localhost:5000/api/admin/stats')
    const fetchStats = async () => {
      // Simulating API latency
      setTimeout(() => {
        setStats({
          totalUsers: 142,
          activeQueries: 89,
          systemHealth: '98.9% Uptime',
          pendingApprovals: 3
        });

        setRecentUsers([
          { id: 1, name: 'Alice Smith', email: 'alice@nexus.com', role: 'Finance', status: 'Active' },
          { id: 2, name: 'Bob Jones', email: 'bob@nexus.com', role: 'HR', status: 'Active' },
          { id: 3, name: 'Charlie Day', email: 'charlie@nexus.com', role: 'Marketing', status: 'Review' },
          { id: 4, name: 'Dana Lee', email: 'dana@nexus.com', role: 'Sales Analysis', status: 'Active' },
        ]);
      }, 500);
    };

    fetchStats();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-wider">NEXUS <span className="text-blue-500 text-sm">ADMIN</span></h1>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <a href="#" className="block px-4 py-3 bg-blue-600 rounded-md shadow-md font-medium">Dashboard Overview</a>
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-md transition text-slate-300">User Management</a>
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-md transition text-slate-300">Search Analytics</a>
          <a href="#" className="block px-4 py-3 hover:bg-slate-800 rounded-md transition text-slate-300">System Logs</a>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Director Overview</h2>
            <p className="text-gray-500">Welcome back, {adminName}</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm hover:bg-gray-50">Settings</button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm text-sm hover:bg-blue-700">Generate Report</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
            <span className="text-green-500 text-xs font-semibold">+12% from last month</span>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">Active Queries (24h)</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeQueries}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">System Health</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.systemHealth}</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase">Pending Approvals</p>
            <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingApprovals}</p>
            <span className="text-xs text-gray-400">Requires attention</span>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Recent User Registrations</h3>
            <button className="text-blue-600 text-sm hover:underline">View All</button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold
                      ${user.role === 'HR' ? 'bg-purple-100 text-purple-700' : 
                        user.role === 'Finance' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-sm ${user.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 mx-1">Edit</button>
                    <button className="text-gray-400 hover:text-red-600 mx-1">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDash;