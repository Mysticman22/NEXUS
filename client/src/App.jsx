import React, { useState } from 'react';
import NexusAuth from './NexusAuth';
import NexusSearch from './NexusSearch'; // We will build this next, or comment it out for now

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        // If not logged in, show Auth Screen
        <NexusAuth onLoginSuccess={(user) => setUser(user)} />
      ) : (
        // If logged in, show Dashboard (Placeholder for now)
        <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
          <h1>Welcome, {user.displayName}</h1>
          <p>Department: {user.department || "Employee"}</p>
        </div>
      )}
    </div>
  );
}

export default App;