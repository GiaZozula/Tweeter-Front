import React, {useState, useEffect} from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Tweet from "../../components/Tweet/Tweet";
import EditProfile from "../../components/EditProfile/EditProfile";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import axios from "axios";
import { following } from "../../redux/userSlice";

const Profile = () => {
    const {currentUser} = useSelector((state) => state.user);
    const [userTweets, setUserTweets] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    // state for the modal
    const [open, setOpen] = useState(false);

    //using useParams to grab the specific user data in the URL and passing it to {id}
    const {id} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // we need to fetch both the tweets and the profile, using the id we got from the params
                const userTweets = await axios.get(`/tweets/user/all/${id}`);
                const userProfile = await axios.get(`/users/find/${id}`);
                // once we have that data we pass it into state (note: need to make sure to go into the data due to the way the object is structured on the backend)
                setUserTweets(userTweets.data);
                setUserProfile(userProfile.data);
            } catch (err) {
                console.log("error", err);
            }
        };

        fetchData();
        // only load when the currentUser and id changes
    }, [currentUser, id]);

    //this handles following and unfollowing users
    const handleFollow = async () => {
        if(!currentUser.following.includes(id)) {
            try {
                await axios.put(`/users/follow/${id}`, {
                    id: currentUser._id,
                });
                dispatch(following(id));
            } catch (err) {
                console.log("error", err)
            }
        } else {
            try {
                await axios.put(`/users/unfollow/${id}`, {
                    id: currentUser._id,
                });
                dispatch(following(id));
            } catch (err) {
                console.log("error", err)
            }
        }
    };

    return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="px-6">
                <LeftSidebar />
            </div>
            <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
                <div className="flex justify-between items-center">
                    {/* this is coming from the state above, if userProfile exists, go to .profilePicture and display */}
                    <img src={userProfile?.profilePicture} alt="Profile" className="w-12 h-12 rounded-full" />
                    {/* if the URL and the currently signed in user's id are the same then we can show them the profile */}
                    {currentUser._id === id ? (
                        // when button is pressed, the modal's state is changed to true
                        <button className="px-4 -y-2 bg-blue-500 rounded-full text-white" onClick={() => setOpen(true)}>
                            Edit Profile
                        </button>
                        // if its not the same, but the current user is following the id from the param, we show them the "following" button
                    ) : currentUser.following.includes(id) ? (
                        <button className="px-4 -y-2 bg-blue-500 rounded-full text-white" onClick={handleFollow}>
                            Following
                        </button>
                    ) : (
                        // if they're also not following, then we show the "follow" button
                        <button className="px-4 -y-2 bg-blue-500 rounded-full text-white" onClick={handleFollow}>
                            Follow
                        </button>
                    )} 
                </div>
                <div className="mt-6">
                    {/* if there are user tweets, map over them */}
                    {userTweets && userTweets.map((tweet) => {
                        return (
                            // check the tweet id to ensure that a particular tweet is being referenced
                            <div className="p-2" key={tweet._id}>
                                {/* and pass them to the tweet component that was brought in here, and setData with setUserTweets so it is more dynamic and refreshable*/}
                                <Tweet tweet={tweet} setData={setUserTweets} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="px-6">
                <RightSidebar />
            </div>        
        </div>
        {/* if the modal is open, display this component. EditProfile takes a prop called setOpen so it can be toggled on and off */}
        {open && <EditProfile setOpen={setOpen}/>}
    </>
    );
};

export default Profile;
