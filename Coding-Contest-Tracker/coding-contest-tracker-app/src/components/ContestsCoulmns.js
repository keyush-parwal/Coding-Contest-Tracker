import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gapi } from 'gapi-script';
// import Popup from 'reactjs-popup/dist/index.css';

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

// const GOOGLE_CLIENT_ID = ''
// const GOOGLE_CLIENT_SECRET = ''


function ContestColumns({ liveContests, todayContests, upcomingContests, selectedPlatforms }) {
    const [activeView, setActiveView] = useState('live');
    const [notificationTime, setNotificationTime] = useState(10); // Default notification time is 10 minutes
    const [signedIn, setSignedIn] = useState(false);

    // const isContestLive = (contest) => {
    //     const currentTime = new Date().getTime();
    //     const startTime = new Date(contest.start_time).getTime();
    //     const endTime = new Date(contest.end_time).getTime();
    //     return startTime <= currentTime && currentTime <= endTime;
    // };

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth2.init({
                clientId: '640752169023-hmmhli2djvmassgi5b2p4o4bvds9b7k5.apps.googleusercontent.com',
                scpe: 'https://www.googleapis.com/auth/calendar',
            });


            gapi.auth2.getAuthInstance().isSignedIn.listen(handleAuthChange);
            handleAuthChange(gapi.auth2.getAuthInstance().isSignedIn.get());
        });

    }, []);

    const handleAuthChange = (isSignedIn) => {
        if (isSignedIn) {
            setSignedIn(true);
            console.log("User is signed in");
        } else {
            // User is not signed in, you can prompt them to sign in
            setSignedIn(false);
            console.log("User is not signed in");
        }
    };

    const signIn = async () => {
        try {
            await gapi.auth2.getAuthInstance().signIn();
            console.log('Sign-in successful');
            // Additional code to execute upon successful sign-in.
        } catch (error) {
            console.error('Sign-in error:', error);
        }
        // gapi.auth2.getAuthInstance().signIn();
    };

    const signOut = () => {
        gapi.auth2.getAuthInstance().signOut();
    };

    const filterContests = (contests) => {
        return contests.filter((contest) => selectedPlatforms.includes(contest.site));
    };

    // const renderTimeBox = (time, isStart) => (
    //     <div className={`rounded-md p-1 text-white ${isStart ? 'bg-green-500' : 'bg-blue-500'}`}>
    //         {new Date(time).toLocaleTimeString('en-US', { hour12: false })}
    //     </div>
    // );

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

        const addToCalendar = () => {
            const start = (contest.start_time.slice(0, 19)).replace(" ", "T");
            const end = (contest.end_time.slice(0, 19)).replace(" ", "T");

            const event = {
                summary: contest.name,
                description: contest.site,
                start: {
                    dateTime: start,
                    timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time (IST)
                },
                end: {
                    dateTime: end,
                    timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time (IST)
                },
            };
            console.log("No Problem till here");

            if (gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get()) {
                // Initialize the Calendar API
                gapi.client.load('calendar', 'v3', () => {
                    // Now you can use the calendar API to insert an event
                    gapi.client.calendar.events
                        .insert({
                            calendarId: 'primary', // You can change this to the desired calendar ID
                            resource: event,
                        })
                        .then((response) => {
                            console.log('Event created:', response);
                        })
                        .catch((error) => {
                            console.error('Error creating event:', error);
                        });
                });
            } else {
                // Handle the case when the user is not signed in or the API client is not loaded
                console.error('User is not signed in or API client is not loaded');
            }

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
                            {/* <Popup trigger=
                                {<button> Click to open popup </button>}
                                position="right center">
                                <div>GeeksforGeeks</div>
                                <button>Click here</button>
                            </Popup> */}
                            {
                                signedIn && <button className="ml-4 bg-green-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={addToCalendar}>
                                    Add to Calendar
                                </button>
                            }
                            {
                                !signedIn && <button className="ml-4 bg-green-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={signIn}>Add to Calendar</button>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    };


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

                // toast.success('Notification alert created successfully', {
                //     autoClose: 2000, // Close after 2 seconds
                // });
            }, notificationTime - currentTime);
        } else {
            toast.error('This contest has already started', {
                autoClose: 2000, // Close after 2 seconds
            });

        }
    };

    // const responseGoogle = (response) => {
    //     console.log("You are successful");
    //     console.log(response);
    //     const { code } = response
    // }

    // const responseError = (error) => {
    //     console.log("Here is an error");
    //     console.log(error)
    // }

    // const createEvent = () => {
    //     const event = {
    //         summary: 'Event Name',
    //         description: 'Event Description',
    //         start: {
    //             dateTime: '2023-01-01T10:00:00',
    //             timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time (IST)
    //         },
    //         end: {
    //             dateTime: '2023-01-01T12:00:00',
    //             timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time (IST)
    //         },
    //     };
    //     console.log("No Problem till here");

    //     if (gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get()) {
    //         // Initialize the Calendar API
    //         gapi.client.load('calendar', 'v3', () => {
    //             // Now you can use the calendar API to insert an event
    //             gapi.client.calendar.events
    //                 .insert({
    //                     calendarId: 'primary', // You can change this to the desired calendar ID
    //                     resource: event,
    //                 })
    //                 .then((response) => {
    //                     console.log('Event created:', response);
    //                 })
    //                 .catch((error) => {
    //                     console.error('Error creating event:', error);
    //                 });
    //         });
    //     } else {
    //         // Handle the case when the user is not signed in or the API client is not loaded
    //         console.error('User is not signed in or API client is not loaded');
    //     }
    // };



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
            <div>
                {/* <GoogleLogin
                    clientId='640752169023-hmmhli2djvmassgi5b2p4o4bvds9b7k5.apps.googleusercontent.com'
                    buttonText='Authorize Calender'
                    onSuccess={responseGoogle}
                    onFailure={responseError}
                    cookiePolicy={'single_host_origin'}
                    responseType='code'
                    accessType='offline'
                    scope='openid email profile https://www.googleapis.com/auth/calendar'
                /> */}



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
