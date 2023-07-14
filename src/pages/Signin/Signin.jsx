import React, {useState} from "react";
import axios from "axios";

// need to import useDispatch in order to further connect react and redux functionality
import {useDispatch} from "react-redux";
//bring in the actions from userSlice
import {loginStart, loginSuccess, loginFailed} from "../../redux/userSlice";

//this allows us to navigate to another page after log in success
import {useNavigate} from "react-router-dom";

const Signin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    //initializing the redux dispatch
    const dispatch = useDispatch();

    //initializing navigate
    const navigate = useNavigate();

    //using async/await here because it will fetch to api
    const handleLogin = async (e) => {
        // because its a form:
        e.preventDefault();

        //dispatch is necessary to use the actions imported above
        //loginStart does not require an additional action to be passed on, as it just updates the state without any data being passed
        dispatch(loginStart());
        
        try {
            //in the server index.js, there is /api/auth 
            // in the "proxy" that is added to the package.json, the localhost address includes /api and stops there, so this "/auth/signin" is added to the end of the address as a result of this function
            //axios post request takes the username and password as they stored in the form, and put them into the server side auth.js, which is looking for a username and a password
            //whatever is input here is passed on to "req.body" in the server's auth.js file 
            //for example if we type in "username" it passed on to "req.body.username"
            const res = await axios.post("/auth/signin", {username, password});

            //once the log in has been successsful, the loginSuccess action needs to be dispatched, which takes the resulting data from the API call
            dispatch(loginSuccess(res.data));
            //and then navigate to our homepage
            navigate("/");
        } catch (err) {
            // if it fails, we will dispatch the loginFailed, without any action passed on as it does not have a paylod, only a function that updates the state
            dispatch(loginFailed());
        }
    };

    //functionality for singing up
    const handleSignUp = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.post("/auth/signup", {email, username, password});
            dispatch(loginSuccess(res.data));
            navigate("/");
        } catch (err) {
            dispatch(loginFailed());
        }
    };    

    return (
    <form className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10">
        <h2 className="text-3xl font-bold text-center">Sign in to Twitter</h2>
        <input 
        // this takes whatever is typed into the input for username and places it into the useState cusername variable above
            onChange={(e) => setUsername(e.target.value)} 
            type="text" 
            placeholder="username" 
            className="text-xl py-2 rounded-full px-4"
        />
        <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="password" 
            className="text-xl py-2 rounded-full px-4"
        />
        <button 
            onClick={handleLogin}
            className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
         >Sign in</button>
        <p className="text-center text-xl">Don't have an account?</p>
        <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="email" 
            required={true} 
            className="text-xl py-2 rounded-full px-4"
        />
        <input
            onChange={(e) => setUsername(e.target.value)}  
            type="text" 
            placeholder="username" 
            className="text-xl py-2 rounded-full px-4"
        />
        <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="password" 
            className="text-xl py-2 rounded-full px-4"
        />   
        <button 
            onClick={handleSignUp}
            className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white" type="submit">Sign Up</button> 
    </form>
    );
};

export default Signin;