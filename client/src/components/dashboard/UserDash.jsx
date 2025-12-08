import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const UserDash = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch the custom claims we set in the Node backend
        const tokenResult = await currentUser.getIdTokenResult();
        
        setUser({
          name: currentUser.displayName,
          email: currentUser.email,
        });
        // Display the specific department (e.g., "Finance" or "HR")
        setRole(tokenResult.claims.employerType || 'Employee');
      }
    };
    fetchUserData();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // TODO: Connect this to your RAG Backend / Python Search API
    console.log(`Nexus Searching for: ${searchQuery}`);
    
    // Simulating a search delay
    setTimeout(() => {
      setIsSearching(false);
      alert(`Search triggered for: "${searchQuery}"\n(Connect this to your RAG API)`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- Header / Navigation --- */}
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="text-xl font-semibold text-gray-700 tracking-tight">Nexus Enterprise</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* --- Main Search Area --- */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 -mt-16">
        
        {/* Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-2">Nexus</h1>
          <p className="text-gray-500">Enterprise Intelligence for {role}</p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:shadow-md transition-all text-lg"
              placeholder="Search internal documents, reports, or analytics..."
            />
            
            {/* Search Button (Optional, Google-style often relies on Enter key, but good for UI) */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
               {isSearching && (
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
               )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button 
              type="submit" 
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md border border-gray-200 text-sm font-medium transition-colors"
            >
              Nexus Search
            </button>
            <button 
              type="button" 
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md border border-gray-200 text-sm font-medium transition-colors"
            >
              I'm Feeling Lucky
            </button>
          </div>
        </form>
      </main>

      {/* --- Footer --- */}
      <footer className="py-4 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Nexus Inc. Secure Environment.</p>
      </footer>
    </div>
  );
};

export default UserDash;