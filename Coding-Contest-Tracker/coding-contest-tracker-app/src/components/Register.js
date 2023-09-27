import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // The user has been registered and signed in
        console.log('User registered:', userCredential.user);
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name // Update the user's display name
        })
          .then(() => {
            console.log('User display name updated:', user.displayName);
            setUser(user); // Set the user state
            // Redirect to /contests
          })
          .catch((error) => {
            console.error('Error updating user display name:', error);
          });
        setUser(userCredential.user.displayName);
        navigate('/contests');
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  };

  const handleGoogleSignUp = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The user has been signed in with Google
        console.log('User signed in with Google:', result.user);
        setUser(result.user.displayName);
        navigate('/contests');
      })
      .catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          console.log('Sign-in popup was closed by the user.');
        } else {
          console.error('Error signing in with Google:', error);
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
      <form className="p-6 bg-white rounded shadow-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 p-2 block w-full border border-gray-300 rounded-md" />
        </div>
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
          Register
        </button>
        <button type="button" onClick={handleGoogleSignUp} className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Sign Up with Google
        </button>
      </form>
    </div>
  );
}

export default Register;
