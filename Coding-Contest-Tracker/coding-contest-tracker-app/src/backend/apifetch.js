import {
    setMyContestsDB,
    getSubscriptionStatusDB,
    setSubscriptionStatusDB,
    setDailyChallengeDB,
    getMyContestsDB,
    fetchGfgDailyQuestion,
    getGfgContests,
} from "../Helper/DbHelper";
var browser = require("webextension-polyfill");



var myContests = [];
var subscriptionStatus = {};

var defaultDailyChallenge = {
    leetcode: {
        title: "Daily Challenge",
        difficulty: "",
        link: "",
        platform: "leetcode",
    },
    geeksforgeeks: {
        title: "Challenge of the Day",
        difficulty: "",
        link: "",
        platform: "geeksforgeeks",
    },
};

// ========================================== Helper ==================================================
function sortFunction(a, b) {
    var dateA = new Date(a.start_time).getTime();
    var dateB = new Date(b.start_time).getTime();
    return dateA > dateB ? 1 : -1;
}

async function fetchContestDetails() {
    const res = await fetch(`https://kontests.net/api/v1/all`, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    if (!res.ok) {
        const message = "An error has occured";
        throw new Error(message);
    }

    var contests = await res.json();
    var gfgContests = await getGfgContests();
    var contestDetails = [...contests, ...gfgContests];

    contestDetails.sort(sortFunction);
    return contestDetails;
}

async function fetchLeetCodeDailyQuestion() {
    const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";
    const DAILY_CODING_CHALLENGE_QUERY = `
    query questionOfToday {
        activeDailyCodingChallengeQuestion {
            link
            question {
                difficulty
                title
            }
        }
    }`;

    const init = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: DAILY_CODING_CHALLENGE_QUERY }),
    };

    let res = await fetch(LEETCODE_API_ENDPOINT, init);
    if (!res.ok) {
        const message = "An error has occured";
        throw new Error(message);
    }
    res = await res.json();

    res = {
        link:
            "https://leetcode.com" + res.data.activeDailyCodingChallengeQuestion.link,
        difficulty: res.data.activeDailyCodingChallengeQuestion.question.difficulty,
        title: res.data.activeDailyCodingChallengeQuestion.question.title,
        platform: "leetcode",
    };
    return res;
}

async function fetchGfgDailyChallenge() {
    var res = await fetchGfgDailyQuestion();
    return res;
}
const updateDailyChallenge = async () => {
    var leetcodeChallenge = await fetchLeetCodeDailyQuestion();
    var gfgChallenge = await fetchGfgDailyChallenge();
    defaultDailyChallenge.leetcode = leetcodeChallenge;
    defaultDailyChallenge.geeksforgeeks = gfgChallenge;

    await setDailyChallengeDB(defaultDailyChallenge);
};

