// not currently using more userSlice, but if we do later we have combineReducers imported
import {configureStore, combineReducers} from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// copied from the Redux docs
// persist is used to be able to have a persistant state even after refresh
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// copied from the Redux docs
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

//this combines any reducers we have
const rootReducer = combineReducers({ user: userReducer});

// copied from the Redux docs
//this is a reducer that takes the persistConfig and the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//this passes on the now combined rootReducer and persistReducer and passes to store
export const store = configureStore({
  reducer: persistedReducer,
// middleware copied from Redux docs      
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

//we then pass the store into persistStore and export it
export const persistor = persistStore(store);