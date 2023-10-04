import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

const Account = ({ user, onUsernamesUpdate }) => {
    const [geeksforGeeksUsername, setGeeksforGeeksUsername] = useState('');
    const [leetCodeUsername, setLeetCodeUsername] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Ensure user object is available before accessing its properties
        if (user) {
            const usersRef = ref(db, `users/${user.uid}`);
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setGeeksforGeeksUsername(data.geeksforGeeksUsername || '');
                    setLeetCodeUsername(data.leetCodeUsername || '');
                }
            });
        }

        // Cleanup function
        return () => {
            // Unsubscribe from the Firebase Realtime Database listener
            // (Note: This is not necessary for onValue listener)
        };
    }, [user]);

    const handleSave = () => {
        set(ref(db, `users/${user.uid}`), {
            geeksforGeeksUsername: geeksforGeeksUsername,
            leetCodeUsername: leetCodeUsername,
        });

        setIsEditing(false);
        onUsernamesUpdate(geeksforGeeksUsername, leetCodeUsername);
    };


    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Account Page</h2>
            <div className="mb-4">
                <label htmlFor="geeksforGeeksUsername" className="block text-lg font-semibold mb-2">
                    GeeksforGeeks Username
                </label>
                <input
                    type="text"
                    id="geeksforGeeksUsername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={geeksforGeeksUsername}
                    onChange={(e) => setGeeksforGeeksUsername(e.target.value)}
                    disabled={!isEditing}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="leetCodeUsername" className="block text-lg font-semibold mb-2">
                    LeetCode Username
                </label>
                <input
                    type="text"
                    id="leetCodeUsername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={leetCodeUsername}
                    onChange={(e) => setLeetCodeUsername(e.target.value)}
                    disabled={!isEditing}
                />
            </div>
            <div className="flex justify-between">
                {isEditing ? (
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
};

export default Account;
