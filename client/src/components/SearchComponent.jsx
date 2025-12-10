import React, { useState } from 'react';
import { db } from '../../config/firebase'; 
import { collection, query, where, getDocs } from "firebase/firestore";

const SearchComponent = () => {
    const [queryTerm, setQueryTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        setResults([]); // Clear previous results

        if (!queryTerm.trim()) {
            setLoading(false);
            return;
        }

        // --- Firestore Prefix Search Query ---
        // 1. Get collection reference
        const usersRef = collection(db, "users");
        
        // 2. Build the query for partial email matching
        // Checks if 'email' field is >= the query term AND <= the query term followed by '\uf8ff'.
        // '\uf8ff' is a very high Unicode character, ensuring all strings starting with queryTerm are included.
        const searchQ = query(
            usersRef,
            where("email", ">=", queryTerm),
            where("email", "<=", queryTerm + '\uf8ff') 
        );

        try {
            const querySnapshot = await getDocs(searchQ);
            const searchResults = [];
            
            querySnapshot.forEach((doc) => {
                searchResults.push({ 
                    id: doc.id, 
                    ...doc.data() 
                });
            });
            
            setResults(searchResults);
        } catch (error) {
            console.error("Error searching users:", error);
            alert("Search failed: Check your Firestore security rules for 'users' collection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">User Search (By Email Prefix)</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    placeholder="Start typing email (e.g., mys...)"
                    value={queryTerm}
                    onChange={(e) => setQueryTerm(e.target.value.toLowerCase())} // Important: Ensure lowercase match
                    className="flex-grow p-2 border border-gray-300 rounded"
                />
                <button 
                    type="submit" 
                    className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    disabled={loading || queryTerm.length < 2}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="mt-4">
                {loading && <p>Loading results...</p>}
                {!loading && results.length > 0 && (
                    <div className="space-y-2">
                        {results.map(user => (
                            <div key={user.id} className="p-3 border rounded bg-white">
                                <p className="font-medium">{user.email}</p>
                                <p className="text-sm text-gray-600">Status: {user.status}</p>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && queryTerm && results.length === 0 && <p className="text-red-500">No users found matching "{queryTerm}"</p>}
            </div>
        </div>
    );
};

export default SearchComponent;