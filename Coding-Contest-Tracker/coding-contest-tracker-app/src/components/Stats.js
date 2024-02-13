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

            {/* Render the external URL below the progress bar */}
            <div className="mt-4">
                <iframe
                    title="External Content"
                    src={`https://leetcard.jacoblin.cool/${leetCodeUsername}?ext=activity&theme=light`}
                    className="w-full h-96"
                />
            </div>
        </div>
    );
};

export default StatsComponent;
