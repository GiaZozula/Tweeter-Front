//this is the placeholder, just takes in the user

import axios from "axios";
import React, { useState, useEffect } from "react";
//need these from the DOM
import { useLocation, useParams } from "react-router-dom";

// setUserData and userData allows for dynamism 
const UserPlaceholder = ({ setUserData, userData }) => {
  const {id} = useParams();
  const location = useLocation().pathname;

  // fetch the user's data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await axios.get(`/users/find/${id}`);
        setUserData(userProfile.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  //if the username exists, display it
  return <div>{userData?.username}</div>;
};

export default UserPlaceholder;