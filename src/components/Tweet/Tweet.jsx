import React, {useState, useEffect} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
//import dateFNS library
import formatDistance from "date-fns/formatDistance";
//import icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

// bring in tweet and setData
const Tweet = ({tweet, setData}) => {
    //we want to access to the currentUser so we bring it in here using the useSelector to reference the user's data
    const {currentUser} = useSelector((state) => state.user);

    // since the tweet can be any user's tweet not just the currently logged in user (such as the tweets from users being followed), we will useState to dynamically update the userData state
    const [userData, setUserData] = useState();

    //using date-fns library, we bring in the createdAt data that stores a tweet's creatino time on MongoDB and convert it into a string that says how long since that time compared to the current time
    const dateStr = formatDistance(new Date(tweet.createdAt), new Date())

    // init useLocation, and specify pathname as we will be using that part of the location data 
    const location = useLocation().pathname;
    // init id from the params of the URL
    const {id} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                //find whoever the user is that made the tweet by accessing the "tweet" prop (that was passed in above) and going within it to grab the userId
                const findUser = await axios.get(`/users/find/${tweet.userId}`);
                //now save this in the userData state
                setUserData(findUser.data);
            } catch (err) {
                console.log("error", err);
            }
        };
        //call the function whenever the userId changes (using useEffect) or if the likes change
        fetchData();
    }, [tweet.userId, tweet.likes]);

    //async function here to fetch to the server
    const handleLike = async (e) => {
        e.preventDefault();
        try {
            // using axios we put a like in there
            const like = await axios.put(`/tweets/${tweet._id}/like`, {
                // along with the id of the current user
                id: currentUser._id,
            });
            // since on the profile and explore pages we are working with a different set of tweets, we have to specfiy which location we are accessing the tweets from
            //if the location is profile or explore, fetch the specific data listed below, otherwise only fetch the tweet itself
            if (location.includes("profile")) {
                //pass the param from URL (that contains the user's ID) and pass on here to get the profile data
                const newData = await axios.get(`/tweets/user/all/${id}`);
                setData(newData.data);
            } else if (location.includes("explore")) {
                const newData = await axios.get(`/tweets/explore`);
                setData(newData.data);
            } else {
                const newData = await axios.get(`/tweets/timeline/${currentUser._id}`);
                setData(newData.data);
            }
        } catch (err) {
            console.log("error", err);
        }
    };

    return (
        <div>
            {/* conditional that says, if userData && the required data exists, then show the data below */}
            {userData && (
                <>
                    <div className="flex space-x-y">
                        {/* profile image */}
                        {/* <img src="" alt="" /> */}
                        {/* we want this to by dynamic we we need the userData*/}
                        <Link to={`/profile/${userData._id}`}>
                            <h3 className="font-bold">{userData.username}</h3>
                        </Link>

                        <span className="font-normal">@{userData.username}</span>
                        <p> - {dateStr}</p>
                    </div>
                    {/* this is the tweets content */}
                    <p>{tweet.description}</p>
                    {/* when the button is clicked, handleLike is called */}
                    <button onClick={handleLike}>
                        {/* if the the current user has already liked this tweet, then we show the "liked" icon, and if not, we show the "not liked" icon. we use "includes" because this is stored in an array */}                        
                        {tweet.likes.includes(currentUser._id) ? (
                        <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
                    ) : ( 
                        <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
                    )}
                    {/* show how many likes */}
                    {tweet.likes.length}
                    </button>
                </>
            )}
        </div>
    );
};

export default Tweet;