import React, {useState} from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";

import {useSelector} from "react-redux";
import axios from "axios";

const MainTweet = () => {
    const [tweetText, setTweetText] = useState("");

    const {currentUser} = useSelector((state) => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // this is where we post the tweets in to the database
        try {
            await axios.post("/tweets", {
                userId: currentUser._id,
                description: tweetText,
            });
            // reload the page to show newly submitted tweet
            window.location.reload(false);
        } catch(err) {
            console.log(err);
        }
    };

    return (
    <div>
        {/* if there is a current user, display the username above the tweet text area*/}
        {currentUser && <p className="font-bold pl-2 my-2">{currentUser.username}</p>}
        <form className="border-b-2 pb-6">
            <textarea 
                // when there is a change to the text, store it in the tweeText state
                onChange={(e) => setTweetText(e.target.value)}
                className="bg-slate-200 rounded-lg w-full p-2" 
                type="text" 
                placeholder="What's Happenin'?" 
                maxLength={280}
            ></textarea>
            <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-4 rounded-full ml-auto">Tweet</button>
        </form>
        {/* bringing in the TimelineTweets */}
        <TimelineTweet />
    </div>
    );
};

export default MainTweet;
