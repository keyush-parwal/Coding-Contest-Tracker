import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'

function SignIn({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                console.error('Error signing in:', error);
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // The user is signed in, update the state
                setUser(user);
                // Redirect to contests page
                navigate('/contests');
            } else {
                // User is signed out, handle the state accordingly
                setUser(null);
            }
        });

        // Clean up the subscription on component unmount
        return () => unsubscribe();
    }, [setUser, navigate]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
            <form className="p-6 bg-white rounded shadow-md" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Password:
                    </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded-md" />
                </div>
                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign In
                </button>
            </form>
        </div>
    );
}

export default SignIn;
