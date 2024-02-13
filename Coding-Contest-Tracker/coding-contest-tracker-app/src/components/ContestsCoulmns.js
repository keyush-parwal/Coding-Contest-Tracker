import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
const mapping = {
    hackerearth: {
        logo: "https://yt3.ggpht.com/ytc/AAUvwngkLcuAWLtda6tQBsFi3tU9rnSSwsrK1Si7eYtx0A=s176-c-k-c0x00ffffff-no-rj",
        color: "#323754",
    },
    atcoder: {
        logo: "https://avatars.githubusercontent.com/u/7151918?s=200&v=4",
        color: "#222222",
    },
    codechef: {
        logo: "https://i.pinimg.com/originals/c5/d9/fc/c5d9fc1e18bcf039f464c2ab6cfb3eb6.jpg",
        color: "#D0C3AD",
    },
    leetcode: {
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
        color: "#FFA20E",
    },
    geeksforgeeks: {
        logo: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190710102234/download3.png",
        color: "#34A853",
    },
    codeforces: {
        logo: "https://i.pinimg.com/736x/b4/6e/54/b46e546a3ee4d410f961e81d4a8cae0f.jpg",
        color: "#3B5998",
    },
    topcoder: {
        logo: "https://images.ctfassets.net/b5f1djy59z3a/3MB1wM9Xuwca88AswIUwsK/dad472153bcb5f75ea1f3a193f25eee2/Topcoder_Logo_200px.png",
        color: "#F69322",
    },
    hackerrank: {
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png",
        color: "#1BA94C",
    },
    cups: {
        logo: "https://clist.by/media/sizes/64x64/img/resources/codingcontest_org.png",
        // yellow color
        color: "#FFD700",
    },
    lightoj: {
        logo: "https://clist.by/media/sizes/64x64/img/resources/lightoj_com.png",
        // blue color
        color: "#0000FF",
    },
    kaggle: {
        logo: "https://clist.by/media/sizes/64x64/img/resources/kaggle_com.png",
        color: "#0000FF"
    }
};


function ContestColumns({ liveContests, todayContests, upcomingContests, selectedPlatforms }) {
    const [activeView, setActiveView] = useState('live');
    const [notificationTime, setNotificationTime] = useState(10); // Default notification time is 10 minutes

    const filterContests = (contests) => {
        return contests.filter((contest) => {
            console.log("contest", contest);
            const platformName = contest.resource.name.split('.')[0].toLowerCase(); // Extract the first word of the platform name and convert to lowercase
            // console.log("platformName", platformName);
            return selectedPlatforms.map(platform => platform.toLowerCase()).includes(platformName);
        });
    };



    const renderContestCards = (contests) => {
        console.log("contests in new", contests);
        if (contests.length === 0) {
            return <div className="text-center text-gray-600 py-4">No contests available.</div>;
        }

        return contests.map((contest, index) => (
            <div key={contest.id || index}>
                {renderContestCard(contest)}
            </div>
        ));
    };

    const renderContestCard = (contest) => {
        const startDate = new Date(contest.start);
        const endDate = new Date(contest.end);
        // console.log("hi", contest)
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

        const resourceNameParts = contest.resource.name.split(".")[0];
        const resourceLower = resourceNameParts.toLowerCase();

        // Access the mapping using the lowercase name
        const mappingValue = mapping[resourceLower];
        // console.log("resourceNameParts", resourceNameParts);
        // console.log("resourceLower", resourceLower);
        // console.log("mappingValue", mappingValue);
        if (!selectedPlatforms.some(platform => platform.toLowerCase() === resourceLower)) {
            // Skip rendering if the platform is not selected
            // console.log("yesssssssssss");
            return null;
        }

        const start24HourFormat = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const end24HourFormat = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return (
            <div
                key={contest.id}
                className="bg-white rounded-lg shadow-md p-4 mb-4 transition duration-300 hover:shadow-lg w-full"
            >
                <div className="flex flex-col md:flex-row">
                    <div className="mr-4">
                        {mapping[resourceLower] && (
                            <img
                                src={mapping[resourceLower].logo}
                                alt={mapping[resourceLower].name}
                                style={{
                                    width: 70,
                                    minWidth: 70,
                                    minHeight: 70,
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
                            href={contest.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-lg font-semibold md:text-xl"
                        >
                            {contest.event}
                        </a>
                        <div className="mt-2">
                            <span className="font-semibold">
                                {mapping[resourceLower]?.name}
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
                        <div className="mt-4 flex flex-wrap items-center">
                            <label htmlFor={`notification-${contest.id}`} className="text-gray-600 font-semibold mr-2">Notification:</label>
                            <select
                                id={`notification-${contest.id}`}
                                className="p-1 rounded border mr-2"
                                value={notificationTime}
                                onChange={(e) => setNotificationTime(Number(e.target.value))}
                            >
                                <option value={10}>10 minutes before</option>
                                <option value={15}>15 minutes before</option>
                                <option value={30}>30 minutes before</option>
                                <option value={60}>1 hour before</option>
                            </select>
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                                onClick={() => setNotification(contest, notificationTime)}
                            >
                                Set Notification
                            </button>
                            <AddToCalendarButton
                                name={contest.event}
                                options={['Apple', 'Google']}
                                location="World Wide Web"
                                startDate={startDate.toISOString().split('T')[0]}
                                endDate={endDate.toISOString().split('T')[0]}
                                startTime={start24HourFormat}
                                endTime={end24HourFormat}
                                buttonStyle="text"
                            ></AddToCalendarButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const setNotification = (contest, minutesBefore) => {
        const user = auth.currentUser;

        if (!user) {
            alert('Please sign in first.');
            return;
        }

        const startTime = new Date(contest.start).getTime();
        const notificationTime = startTime - minutesBefore * 60 * 1000;

        if (notificationTime > new Date().getTime()) {
            toast.success('Notification alert created successfully', {
                autoClose: 2000,
            });

            const recipientEmail = user.email;

            fetch('https://coding-contest-tracker-f2t9dpkiw-akshat202002.vercel.app/send-email', { // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: recipientEmail,
                    subject: `Contest Reminder: ${contest.event}`,
                    message: `The contest "${contest.event}" is starting soon at ${new Date(
                        contest.start
                    ).toLocaleString()}.`,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Email sent successfully');
                    } else {
                        console.error('Failed to send email:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error sending email:', error);
                });

            setTimeout(() => {
                new Notification(`Contest Reminder: ${contest.event}`, {
                    body: `The contest "${contest.event}" is starting soon.`,
                });
                console.log('Notification created.');
            }, notificationTime - new Date().getTime());
        } else {
            toast.error('This contest has already started', {
                autoClose: 2000,
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
                {activeView === 'today' && renderContestCards(filterContests(todayContests))}
                {activeView === 'live' && renderContestCards(filterContests(liveContests))}
                {activeView === 'upcoming' && renderContestCards(filterContests(upcomingContests))}
            </div>
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}

export default ContestColumns;
