import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const mapping = {
    HackerEarth: {
        logo: "https://yt3.ggpht.com/ytc/AAUvwngkLcuAWLtda6tQBsFi3tU9rnSSwsrK1Si7eYtx0A=s176-c-k-c0x00ffffff-no-rj",
        color: "#323754",
    },
    AtCoder: {
        logo: "https://avatars.githubusercontent.com/u/7151918?s=200&v=4",
        color: "#222222",
    },
    CodeChef: {
        logo: "https://i.pinimg.com/originals/c5/d9/fc/c5d9fc1e18bcf039f464c2ab6cfb3eb6.jpg",
        color: "#D0C3AD",
    },
    LeetCode: {
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
        color: "#FFA20E",
    },
    GeeksforGeeks: {
        logo: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190710102234/download3.png",
        color: "#34A853",
    },
    CodeForces: {
        logo: "https://i.pinimg.com/736x/b4/6e/54/b46e546a3ee4d410f961e81d4a8cae0f.jpg",
        color: "#3B5998",
    },
    TopCoder: {
        logo: "https://images.ctfassets.net/b5f1djy59z3a/3MB1wM9Xuwca88AswIUwsK/dad472153bcb5f75ea1f3a193f25eee2/Topcoder_Logo_200px.png",
        color: "#F69322",
    },
    HackerRank: {
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png",
        color: "#1BA94C",
    },
};
function ContestColumns({ liveContests, todayContests, upcomingContests, selectedPlatforms }) {
    const [activeView, setActiveView] = useState('today');
    const [notificationTime, setNotificationTime] = useState(10); // Default notification time is 10 minutes

    const isContestLive = (contest) => {
        const currentTime = new Date().getTime();
        const startTime = new Date(contest.start_time).getTime();
        const endTime = new Date(contest.end_time).getTime();
        return startTime <= currentTime && currentTime <= endTime;
    };

    const filterContests = (contests) => {
        return contests.filter((contest) => selectedPlatforms.includes(contest.site));
    };

    const renderTimeBox = (time, isStart) => (
        <div className={`rounded-md p-1 text-white ${isStart ? 'bg-green-500' : 'bg-blue-500'}`}>
            {new Date(time).toLocaleTimeString('en-US', { hour12: false })}
        </div>
    );

    const renderContestCard = (contest) => {
        const startDate = new Date(contest.start_time);
        const endDate = new Date(contest.end_time);

        // Format date and time strings
        const dateRangeString = `${startDate.toLocaleDateString('en-US', {
            weekday: 'short',
        })}, ${startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })} - ${endDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })}`;

        const timeRangeString = `${startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })} - ${endDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;

        if (!selectedPlatforms.includes(contest.site)) {
            // Skip rendering if the platform is not selected
            return null;
        }

        return (
            <div
                key={contest.name}
                className="bg-white rounded-lg shadow-md p-4 mb-4 transition duration-300 hover:shadow-lg w-full"
            >
                <div className="flex flex-col md:flex-row">
                    <div className="mr-4">
                        {mapping[contest.site] && (
                            <img
                                src={mapping[contest.site].logo}
                                alt={mapping[contest.site].name}
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 2,
                                    alignSelf: "center",
                                    cursor: "default",
                                }}
                            />
                        )}
                    </div>
                    <div className="flex-grow">
                        <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-lg font-semibold md:text-xl"
                        >
                            {contest.name}
                        </a>
                        <div className="mt-2">
                            <span className="font-semibold">
                                {mapping[contest.site]?.name}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="bg-blue-100 rounded p-1 text-sm">
                                {dateRangeString}
                            </span>
                        </div>
                        <div className="mt-2">
                            <span className="bg-green-100 rounded p-1 text-sm">
                                {timeRangeString}
                            </span>
                        </div>
                        <div className="mt-4">
                            <label htmlFor={`notification-${contest.name}`} className="text-gray-600 font-semibold">Notification:</label>
                            <select
                                id={`notification-${contest.name}`}
                                className="ml-2 p-1 rounded border"
                                value={notificationTime}
                                onChange={(e) => setNotificationTime(Number(e.target.value))}
                            >
                                <option value={10}>10 minutes before</option>
                                <option value={15}>15 minutes before</option>
                                <option value={30}>30 minutes before</option>
                                <option value={60}>1 hour before</option>
                            </select>
                            <button
                                className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                onClick={() => setNotification(contest, notificationTime)}
                            >
                                Set Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    const liveContestsList = liveContests.filter(isContestLive);

    const setNotification = (contest, minutesBefore) => {
        const startTime = new Date(contest.start_time).getTime();
        const notificationTime = startTime - minutesBefore * 60 * 1000; // Calculate the notification time
        console.log("Notification time: ", notificationTime);
        console.log("Start time: ", startTime);
        const currentTime = new Date().getTime();
        console.log("Remaining time: ", notificationTime - currentTime);
        console.log("Current time: ", currentTime);
        if (notificationTime > currentTime) {
            toast.success('Notification alert created successfully', {
                autoClose: 2000, // Close after 2 seconds
            });
            setTimeout(() => {
                new Notification(`Contest Reminder: ${contest.name}`, {
                    body: `The contest "${contest.name}" is starting soon.`,
                });
                console.log("Notification created.");
                // Show a toast notification

                toast.success('Notification alert created successfully', {
                    autoClose: 2000, // Close after 2 seconds
                });
            }, notificationTime - currentTime);
        } else {
            toast.error('This contest has already started', {
                autoClose: 2000, // Close after 2 seconds
            });

        }
    };

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                <button
                    className={`py-2 px-4 rounded ${activeView === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => setActiveView('today')}
                >
                    Today
                </button>
                <button
                    className={`py-2 px-4 rounded ${activeView === 'live' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => setActiveView('live')}
                >
                    Live Contests
                </button>
                <button
                    className={`py-2 px-4 rounded ${activeView === 'upcoming' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    onClick={() => setActiveView('upcoming')}
                >
                    Upcoming Contests
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-2">
                {activeView === 'today' && filterContests(todayContests).map((contest) => renderContestCard(contest))}
                {activeView === 'live' && filterContests(liveContests).map((contest) => renderContestCard(contest))}
                {activeView === 'upcoming' && filterContests(upcomingContests).map((contest) => renderContestCard(contest))}
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}

export default ContestColumns;
