import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    isLoading: false,
    error: false,
};

// here we bring in redux toolkit for state management
export const userSlice = createSlice({
  name: "user",
  //this passes in the state defined above
  initialState,
  //here we have the reducer that will update the state dynamically
  reducers: {
    // once the user starts logging in (after button press) loading becomes true
    loginStart: (state) => {
      state.isLoading = true;
    },
    // once we do a dispatch on sign in, we pass in the state and the action
    // the action is the data that we want to pass in so we can update the state in here with this new data
    loginSuccess: (state, action) => {
      state.isLoading = false;
      // once we get the data from the user clicking the sign in button ("res.data"), "loginSucess" is called and the user's data is passed on as the payload of this action
      //This is then passed on to the currentUser which is stored in the state
      //at initialState the currentUser is null, after this process it will have all of the data stored for the user on the database
      state.currentUser = action.payload;
    },
    loginFailed: (state) => {
      state.isLoading = false;
      state.error = true;
    },
    logout: (state) => {
      return initialState;
    },
    // this action is coming with the URL
    changeProfile: (state, action) => {
      state.currentUser.profilePicture = action.payload;
    },
    following: (state, action) => {
      // if the user is included in the currentUser's following list, we filter through it and unfollow
      if(state.currentUser.following.includes(action.payload)) {
        state.currentUser.following.splice(state.currentUser.following.findIndex((followingId) => followingId === action.payload))
        //otherwise we push the user's id to the currentUser's following list
      } else {
        state.currentUser.following.push(action.payload);
      }
    },
  },
});

//export all of the actions, which allows us to use all of these actions on the frontend
export const { loginStart, loginSuccess, loginFailed, logout, changeProfile, following } =
  userSlice.actions;

//also need to export the reducer itself in order to build the store
export default userSlice.reducer;