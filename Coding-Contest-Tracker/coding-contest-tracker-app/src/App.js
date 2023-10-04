import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ContestColumns from './components/ContestsCoulmns';
import Subscribe from './components/Subscribe';
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

function App() {
  const [activeTab, setActiveTab] = useState('contests');
  const [contests, setContests] = useState([]);
  const [liveContests, setLiveContests] = useState([]);
  const [todayContests, setTodayContests] = useState([]);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [subscribedContests, setSubscribedContests] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(Object.keys(mapping));

  useEffect(() => {
    const storedPlatforms = JSON.parse(localStorage.getItem('selectedPlatforms')) || [];
    setSelectedPlatforms(storedPlatforms);
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubscribe = (subscribed) => {
    setSubscribedContests(subscribed);
  };

  return (
    <div>
      <Navbar onTabChange={handleTabChange} />
      {activeTab === 'contests' ? (
        <ContestColumns
          liveContests={liveContests}
          todayContests={todayContests}
          upcomingContests={upcomingContests}
          selectedPlatforms={selectedPlatforms}
        />
      ) : (
        <Subscribe
          selectedPlatforms={selectedPlatforms}
          onUpdatePlatforms={updateSelectedPlatforms}
          onSubscribe={handleSubscribe}
        />
      )}

      {/* <ToastContainer position="top-right" autoClose={5000} /> */}
    </div>
  );
}

export default App;
