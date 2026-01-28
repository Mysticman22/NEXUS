import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions"; 

const AdminDash = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Initialize Cloud Functions and the callable function
    const functions = getFunctions();
    const approveUserCallable  = httpsCallable(functions, 'approveUser');
   
    useEffect(() => {
        // Query Firestore for users where status is PENDING
        const q = query(collection(db, "users"), where("status", "==", "PENDING"));
        
        // Listen for real-time updates (Dashboard updates instantly)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Safely convert Firestore timestamp to a Date object
                const registeredDate = data.registeredAt ? data.registeredAt.toDate() : new Date();
                users.push({ id: doc.id, registeredAt: registeredDate, ...data });
            });
            setPendingUsers(users);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching pending users:", error);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on component unmount

    }, []);

    const handleApprove = async (userUid, userEmail) => {
        if (!window.confirm(`Are you sure you want to approve user: ${userEmail}? This will grant them access.`)) return;

        try {
            // CALL CLOUD FUNCTION using the secure callable mechanism
            const result = await approveUserCallable({ uid: userUid });
            
            alert(`User ${userEmail} approved successfully! Message: ${result.data.message}`);
        } catch (error) {
            console.error("Error approving user via function:", error);
            alert(`Approval Failed. Details: ${error.message}`);
        }
    };

    if (loading) return <div>Loading pending users...</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Admin Dashboard: Pending Users ({pendingUsers.length})</h1>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Registered</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">{user.registeredAt.toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleApprove(user.id, user.email)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Approve
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {pendingUsers.length === 0 && <p className="mt-4 text-green-700">No users currently awaiting approval.</p>}
        </div>
    );
};

export default AdminDash; 