import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import MainTweet from "../../components/MainTweet/MainTweet";
import Signin from "../Signin/Signin";

// need to check if the user is logged in, if so we show them the homepage, if not, show sign in
// to do this, we need selector from Redux
// selector goes to the store and finds the state, doesn't make changes unlike dispatch, it just refers to the state
// if there is a user's data inside the currentUser within the state, then we show the homepage, if not, we don't
import {useSelector} from "react-redux";





const Home = () => {
    // this takes the currentUser value in state (after it has been defined by the whole sign in process) and brings it out/passes it on so we can use it on the front end
    //now we can play around with the user's info with ternary operators etc
    // this is a destructured version of "const user = useSelector((state) => state.user.currentUser)"    
    const {currentUser} = useSelector((state) => state.user);

    return (
        <>{
            // if there is no currentUser, show Sign in
            !currentUser ? (
                <Signin/>               
            ) : (
                //otherwise, show them the home page
                <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="px-6">
                        <LeftSidebar />
                    </div>
                <div className="col-span-2 border-x-2 border-t-slate-800 px-6">
                        <MainTweet />
                    </div>  
                    <div className="px-6">
                        <RightSidebar />    
                    </div>  
                </div>                
            )
        } </>
    );
};

export default Home;