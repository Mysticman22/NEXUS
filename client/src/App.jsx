import React, { useState } from 'react';
import NexusAuth from './NexusAuth';
import NexusSearch from './NexusSearch'; // Import the new page

function App() {
  // State to track if user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      {isAuthenticated ? (
        // If logged in, show Search
        <NexusSearch />
      ) : (
        // If NOT logged in, show Auth and pass the "Success" function
        <NexusAuth onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;