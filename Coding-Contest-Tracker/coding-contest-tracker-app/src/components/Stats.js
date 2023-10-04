import React, { useEffect, useState } from 'react';

const StatsComponent = ({ user, leetCodeUsername }) => {
    const [totalSolved, setTotalSolved] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        if (user) {
            fetch(`https://leetcode-stats-api.herokuapp.com/${leetCodeUsername}?t=${Date.now()}`)
                .then(response => response.json())
                .then(data => {
                    setTotalSolved(data.totalSolved);
                    setTotalQuestions(data.totalQuestions);
                })
                .catch(error => console.log(error));
        } else {
            // Reset the state when the user logs out
            setTotalSolved(0);
            setTotalQuestions(0);
        }
    }, [user, leetCodeUsername]);

    const progress = (totalSolved / totalQuestions) * 100;
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Stats</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Total Problems Solved</h3>
                <div className="flex items-center">
                    <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                        <circle r="70" cx="80" cy="80" fill="transparent" stroke="#e0e0e0" strokeWidth="12px"></circle>
                        <circle
                            r="70"
                            cx="80"
                            cy="80"
                            fill="transparent"
                            stroke="#60e6a8"
                            strokeLinecap="round"
                            strokeWidth="12px"
                            strokeDasharray={`${circumference}px`}
                            strokeDashoffset={`${offset}px`}
                        ></circle>
                    </svg>
                    <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-800">{totalSolved} / {totalQuestions}</p>
                    </div>
                </div>
            </div>
            {/* Render the external URL below the progress bar */}
            <div className="mt-4">
                <iframe
                    title="External Content"
                    src="https://leetcard.jacoblin.cool/iwilltrickyou?ext=activity&theme=light"
                    className="w-full h-96"
                />
            </div>
        </div>
    );
};

export default StatsComponent;
