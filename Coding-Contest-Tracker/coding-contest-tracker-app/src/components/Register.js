import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import VerificationPending from './VerificationPending';
function Register({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const authInstance = getAuth();
    createUserWithEmailAndPassword(authInstance, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Send email verification
        sendEmailVerification(user)
          .then(() => {
            setIsEmailSent(true); // Set email sent state to true
            console.log('Email verification sent to:', user.email);
            navigate(`/verification-pending/${user.email}`);
          })
          .catch((error) => {
            console.error('Error sending email verification:', error);
          });
        // Update the user's display name
        setUser(user);
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
