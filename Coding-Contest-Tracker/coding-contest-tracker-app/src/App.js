import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ContestColumns from './components/ContestsCoulmns';
import Subscribe from './components/Subscribe';
import { toast, ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './components/SignIn';
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { ref, set, get, child, onValue } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import the auth hook from react-firebase-hooks
import StatsComponent from './components/Stats';
import Account from './components/Account';
import VerificationPending from './components/VerificationPending';

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

function App() {
  const [activeTab, setActiveTab] = useState('contests');
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
        console.log("user", user);
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
    const storedPlatforms = JSON.parse(localStorage.getItem('selectedPlatforms')) || [];
    setSelectedPlatforms(storedPlatforms);
  }, []);

  useEffect(() => {
    fetch('https://kontests.net/api/v1/all')
      .then((response) => response.json())
      .then((data) => {
        const currentDate = new Date();
        const live = [];
        const today = [];
        const upcoming = [];

        data.forEach((contest) => {
          const startTime = new Date(contest.start_time);
          if (startTime <= currentDate) {
            live.push(contest);
          } else if (
            startTime.getDate() === currentDate.getDate() &&
            startTime.getMonth() === currentDate.getMonth() &&
            startTime.getFullYear() === currentDate.getFullYear()
          ) {
            today.push(contest);
          } else {
            upcoming.push(contest);
          }
        });

        setLiveContests(live);
        setTodayContests(today);
        setUpcomingContests(upcoming);
        setContests(data);
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
