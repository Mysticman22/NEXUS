import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Grid, Bell, FileText, User, Folder, ArrowRight } from 'lucide-react';
import './NexusAuth.css';

// 1. THE MOCK DATABASE (Fake Enterprise Data)
const MOCK_DATABASE = [
  { id: 1, title: "Project Apollo Specs", type: "pdf", category: "Engineering", date: "2024-12-01" },
  { id: 2, title: "Q4 Financial Report", type: "excel", category: "Finance", date: "2024-11-20" },
  { id: 3, title: "Sarah Connor", type: "employee", category: "HR Manager", date: "Active" },
  { id: 4, title: "Nexus API Documentation", type: "doc", category: "Engineering", date: "2024-10-15" },
  { id: 5, title: "Employee Handbook v2", type: "pdf", category: "HR", date: "2023-01-10" },
  { id: 6, title: "John Smith", type: "employee", category: "Senior Dev", date: "Active" },
];

const NexusSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;

    // 2. THE SEARCH LOGIC
    const filtered = MOCK_DATABASE.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(filtered);
    setHasSearched(true);
  };

  // Helper to choose icon based on type
  const getIcon = (type) => {
    if (type === 'employee') return <User size={20} color="#3b82f6" />;
    if (type === 'pdf' || type === 'doc') return <FileText size={20} color="#ef4444" />;
    return <Folder size={20} color="#eab308" />;
  };

  return (
    <div className="nexus-container" style={{alignItems: 'flex-start', paddingTop: '100px', overflowY: 'auto'}}>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>

      {/* Nav */}
      <nav className="glass-nav" style={{
        position: 'fixed', top: 0, width: '100%', padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20,
        backdropFilter: 'blur(10px)', background: 'rgba(15, 23, 42, 0.7)'
      }}>
        <h2 style={{color: 'white', fontWeight: 'bold', fontSize: '1.5rem'}}>Nexus</h2>
        <div style={{display: 'flex', gap: '20px', color: '#94a3b8'}}>
            <Grid size={24} />
            <Bell size={24} />
            <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>JD</div>
        </div>
      </nav>

      <div className="glass-card" style={{maxWidth: '800px', margin: '0 auto', padding: '3rem', width: '100%'}}>
        
        <motion.h1 
          animate={{ scale: hasSearched ? 0.8 : 1 }}
          style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}
        >
          {hasSearched ? "Search Results" : "Enterprise Search"}
        </motion.h1>

        <form onSubmit={handleSearch} style={{position: 'relative', marginBottom: '2rem'}}>
          <Search size={24} style={{position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
          <input 
            type="text" 
            placeholder="Try searching 'Sarah' or 'Report'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', 
              fontSize: '1.2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(15, 23, 42, 0.6)', color: 'white', outline: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          />
          <button type="submit" style={{display: 'none'}}>Search</button>
        </form>

        {/* 3. THE RESULTS LIST */}
        <div className="results-area">
          <AnimatePresence>
            {hasSearched && results.length === 0 && (
               <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:'center', color:'#94a3b8'}}>No results found.</motion.p>
            )}

            {results.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '15px',
                  padding: '15px', marginBottom: '10px',
                  background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'
                }}
              >
                <div style={{padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}>
                  {getIcon(item.type)}
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{color: 'white', fontSize: '1.1rem', margin: 0}}>{item.title}</h3>
                  <p style={{color: '#94a3b8', fontSize: '0.9rem', margin: 0}}>{item.category} • {item.date}</p>
                </div>
                <ArrowRight size={18} color="#64748b" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default NexusSearch;