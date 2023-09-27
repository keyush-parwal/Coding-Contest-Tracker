import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
function Navbar({ user, setUser }) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    const handleLogout = () => {
        // Sign out the user using Firebase's signOut function
        signOut(auth)
            .then(() => {
                // Successfully signed out, update the user state
                setUser(null);
                localStorage.removeItem('selectedPlatforms');
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <nav className="bg-blue-500 p-2 md:p-4 text-white">
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center justify-between">
                <li>
                    <Link to="/contests" className="cursor-pointer hover:underline text-center md:text-left">
                        Contests
                    </Link>
                </li>
                <li>
                    <Link to="/subscribe" className="cursor-pointer hover:underline text-center md:text-left">
                        Subscribe
                    </Link>
                </li>
                <li className="relative cursor-pointer" onClick={toggleProfileDropdown}>
                    {user ? (
                        <div className="flex items-center">
                            <span>{user.displayName}</span>
                            <FontAwesomeIcon icon={faUser} className="ml-2" />
                        </div>
                    ) : (
                        <FontAwesomeIcon icon={faUser} />
                    )}
                    {showProfileDropdown && (
                        <ul className="absolute top-8 right-0 bg-white text-black border border-gray-300 rounded-md shadow-lg">
                            {user ? (
                                <>
                                    <li className="cursor-pointer py-2 px-4 hover:bg-gray-100">
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                    <li className="cursor-pointer py-2 px-4 hover:bg-gray-100" onClick={handleLogout}>
                                        Logout
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="cursor-pointer py-2 px-4 hover:bg-gray-100">
                                        <Link to="/register">Register</Link>
                                    </li>
                                    <li className="cursor-pointer py-2 px-4 hover:bg-gray-100">
                                        <Link to="/signin">Sign In</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
