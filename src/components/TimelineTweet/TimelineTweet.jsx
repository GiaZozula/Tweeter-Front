import React, { useEffect, useState } from "react";
import axios from "axios";

import {useSelector} from "react-redux";
import Tweet from "../Tweet/Tweet";

const TimelineTweet = () => {
    const [timeLine, setTimeLine] = useState(null);
    
    //go to the state, find the current user and bring it in here
    const {currentUser} = useSelector((state) => state.user);

    //fetch the data on the first load and then pass it on to the timeline
    useEffect(() => {
        // here we are creating a function in order to use async/await with useEffect(), as you cannot use useEffect() with async
        const fetchData = async () => {
            try {
                //fetch all the tweets by going to the tweets route, going to the timeline in there, hitting the user id (which is in tweets.js "/timeline/:id") and takes all the backend data from the _id and passes it to the frontend
                const timelineTweets = await axios.get(
                    `/tweets/timeline/${currentUser._id}`
                );
                //pass this timeline data into the state above
                setTimeLine(timelineTweets.data);
            } catch (err) {
                console.log("error", err);
            }
        };
        // only call this fetchData async function when there is data in the currentUser._id, not all the time (why we're using a useEffect)
        fetchData();
    }, [currentUser._id]);

    return (
    <div className="mt-6">
        {timeLine && 
            timeLine.map((tweet) => {
            return (
                <div key={tweet._id} className="p-2">
                    {/* Since we want to use Tweet in a variety of places and have the ability to refresh this page dynamically after a new tweet is made, we add tweet and setData */}
                    <Tweet tweet={tweet} setData={setTimeLine}/>
                </div>
            );
        })}
    </div>
    );
};

export default TimelineTweet;