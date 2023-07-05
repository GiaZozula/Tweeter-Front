import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

// disabling react devtools for deployment
if (process.env.NODE_ENV === 'production') disableReactDevTools()

//connecting redux to react requires navigating to the root file (index.js, here!) 
//first, importing provider from the react-redux package 
import {Provider} from "react-redux";
//second, importing the store 
import {store} from "./redux/store";

//now to make thing persistant...
//copied from Redux persist docs
import { PersistGate } from "redux-persist/integration/react";
//import the persistor we set up in store
import { persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* third, we wrap the app with the provider, with store being passed in as props to the store */}
    <Provider store={store}>
      {/* fourth, we wrape the App in a PersistGate */}
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
