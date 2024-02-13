import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ContestColumns from './components/ContestsCoulmns';
import Subscribe from './components/Subscribe';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './components/SignIn';
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { ref, get, onValue } from 'firebase/database';
// import { useAuthState } from 'react-firebase-hooks/auth'; // Import the auth hook from react-firebase-hooks
import StatsComponent from './components/Stats';
import Account from './components/Account';
import VerificationPending from './components/VerificationPending';

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


function App() {
  const [contests, setContests] = useState([]);
  const [liveContests, setLiveContests] = useState([]);
  const [todayContests, setTodayContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [subscribedContests, setSubscribedContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(Object.keys(mapping));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Firebase Auth state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        // console.log("user", user);
        setUser(user);
        // Load selected platforms from Firebase Realtime Database if the user is authenticated
        const userRef = ref(db, `users/${user.uid}/selectedPlatforms`);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setSelectedPlatforms(snapshot.val());
            }
          })
          .catch((error) => {
            console.error('Error loading selected platforms:', error);
          });

        // Load usernames from Firebase Realtime Database
        const usersRef = ref(db, `users/${user.uid}`);
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setGeeksforGeeksUsername(data.geeksforGeeksUsername || '');
            setLeetCodeUsername(data.leetCodeUsername || '');
          }
        });
      } else {
        // User is signed out
        setUser(null);
        // Load selected platforms from local storage if the user is not authenticated
        const storedPlatforms = JSON.parse(localStorage.getItem('selectedPlatforms')) || [];
        setSelectedPlatforms(storedPlatforms);
      }
    });

    return () => {
      // Unsubscribe from the Firebase Auth state change listener
      unsubscribe();
    };
  }, []);



  const updateSelectedPlatforms = (newSelectedPlatforms) => {
    setSelectedPlatforms(newSelectedPlatforms);
    localStorage.setItem('selectedPlatforms', JSON.stringify(newSelectedPlatforms));
  };

  useEffect(() => {
    // Fetch contests from the new API
    fetch('https://coding-contest-tracker-f2t9dpkiw-akshat202002.vercel.app/clist-proxy')
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        const currentDate = new Date();
        const live = [];
        const today = [];
        const upcoming = [];

        if (Array.isArray(data.objects)) {
          data.objects.forEach((contest) => {
            const startTime = new Date(contest.start);
            const endTime = new Date(contest.end);

            // Check if the contest is live
            if (startTime <= currentDate && endTime > currentDate) {
              live.push(contest);
            } else if (
              startTime.getDate() === currentDate.getDate() &&
              startTime.getMonth() === currentDate.getMonth() &&
              startTime.getFullYear() === currentDate.getFullYear()
            ) {
              today.push(contest);
            } else if (startTime > currentDate) {
              upcoming.push(contest);
            }
          });
        } else {
          console.error('Invalid data format from clist.by API');
        }

        setLiveContests(live);
        setTodayContests(today);
        setUpcomingContests(upcoming);
        setContests(data.objects);
        console.log("live", live);
        console.log("today", today);
        console.log("upcoming", upcoming);
        console.log("data.objects", data.objects);
      })
      .catch((error) => {
        console.error('Error fetching contests:', error);
      });
  }, []);



  const handleSubscribe = (subscribed) => {
    setSubscribedContests(subscribed);
  };

  // return (
  //   <div>
  //     <Navbar onTabChange={handleTabChange} />
  //     {activeTab === 'contests' ? (
  //       <ContestColumns
  //         liveContests={liveContests}
  //         todayContests={todayContests}
  //         upcomingContests={upcomingContests}
  //         selectedPlatforms={selectedPlatforms}
  //       />
  //     ) : (
  //       <Subscribe
  //         selectedPlatforms={selectedPlatforms}
  //         onUpdatePlatforms={updateSelectedPlatforms}
  //         onSubscribe={handleSubscribe}
  //       />
  //     )}

  //     {/* <ToastContainer position="top-right" autoClose={5000} /> */}
  //   </div>
  // );

  function RedirectToContests() {
    const navigate = useNavigate();

    useEffect(() => {
      navigate('/contests');
    }, [navigate]);

    return null;
  }
  const [geeksforGeeksUsername, setGeeksforGeeksUsername] = useState('');
  const [leetCodeUsername, setLeetCodeUsername] = useState('');

  const handleUsernamesUpdate = (geeksforGeeksUsername, newLeetCodeUsername) => {
    setGeeksforGeeksUsername(geeksforGeeksUsername);
    setLeetCodeUsername(newLeetCodeUsername);
  };


  return (
    <Router>
      <div>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<RedirectToContests />} />
          <Route path="/contests" element={<ContestColumns liveContests={liveContests} todayContests={todayContests} upcomingContests={upcomingContests} selectedPlatforms={selectedPlatforms} />} />
          <Route path="/subscribe" element={<Subscribe selectedPlatforms={selectedPlatforms} onUpdatePlatforms={updateSelectedPlatforms} onSubscribe={handleSubscribe} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/stats" element={<StatsComponent user={user} leetCodeUsername={leetCodeUsername} />} />
          <Route path="/account" element={<Account user={user} onUsernamesUpdate={handleUsernamesUpdate} />} />
          <Route path="/verification-pending/:email" element={<VerificationPending />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
