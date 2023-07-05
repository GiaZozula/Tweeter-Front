import React, {useEffect, useState} from "react";

import axios from "axios";
import {useSelector} from "react-redux";
import Tweet from "../Tweet/Tweet";

const ExploreTweets = () => {
    const [explore, setExplore] =  useState(null);
    //bring in the currentuser
    const {currentUser} = useSelector((state) => state.user);

    // fetch the data if there is a user id available
    useEffect(() => {
        const fetchData = async () => {
            try {
                //fetch the tweets (from the tweets-->tweet backend route)
                const exploreTweets = await axios.get("/tweets/explore");
                // once the tweets a fetched, update the explore state and display the jsx
                setExplore(exploreTweets.data);
            } catch (err) {
                console.log("error", err);
            }
        }
        fetchData();
    }, [currentUser._id]);

    return (
    <div className="mt-6">
        {explore && explore.map((tweet) => {
            return (
                // add a key to this div so react knows which tweet we're referring to
                <div key={tweet._id} className="p-2">
                    {/* this ensures that the explore page is dynamically updated 
                    // if anything changes on the explore page, the fetch is done again
                    //for example, if a tweet is liked, Tweet.jsx component fetches newData.data and passes it to setData, and here on this page, setData is also updated anytime the exploreTweets is updated*/}
                    <Tweet tweet={tweet} setData={setExplore} />
                </div>
            );
        })}
    </div>
    );
};

export default ExploreTweets;