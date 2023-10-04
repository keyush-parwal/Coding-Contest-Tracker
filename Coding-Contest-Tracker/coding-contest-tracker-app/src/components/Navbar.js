import React, { useState } from 'react';

function Navbar({ onTabChange }) {
    const [activeTab, setActiveTab] = useState('contests');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <nav className="bg-blue-500 p-2 md:p-4 text-white">
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <li
                    className={`cursor-pointer hover:underline text-center md:text-left ${activeTab === 'contests' ? 'font-semibold' : ''
                        }`}
                    onClick={() => handleTabChange('contests')}
                >
                    Contests
                </li>
                <li
                    className={`cursor-pointer hover:underline text-center md:text-left ${activeTab === 'subscribe' ? 'font-semibold' : ''
                        }`}
                    onClick={() => handleTabChange('subscribe')}
                >
                    Subscribe
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
