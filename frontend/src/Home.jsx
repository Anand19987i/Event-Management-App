import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Herosection from './components/Herosection';
import ViewEvent from './Host/ViewEvent';
import RecommendationModel from './Host/Recommendation/RecommendationModel';
import RegisterPopup from './components/RegisterPopup';
import EventSuggestion from '@/components/EventSuggetion/EventSuggestion';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { updateFirstTimeStatus } from './redux/authSlice';
import Footer from './components/Footer';

const Home = () => {
  const { user, isFirstTime } = useSelector(store => store.auth);
  const [showPopup, setShowPopup] = useState(false);
  const [showEventSuggestion, setShowEventSuggestion] = useState(false);
  const dispatch = useDispatch();
  // Show registration popup for unauthenticated users
  useEffect(() => {
    if (!user?._id) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Show event suggestion for first-time users
  // useEffect(() => {
  //   if (user?.isFirstTime) {
  //     setShowEventSuggestion(true);
  //   }
  // }, [user]);
   console.log(user?._id);  


  // Show event suggestion logic
  useEffect(() => {
    if (user?.isFirstTime) {
      setShowEventSuggestion(true);
    }
  }, [user]);
  const markAsNotFirstTime = async () => {
    try {
      // Ensure the user is authenticated before proceeding
      if (!user?._id) {
        console.error('User is not authenticated');
        return;
      }
  
      // Send the request with the user's credentials
      const response = await axios.put(
        `${USER_API_END_POINT}/mark-as-not-first-time`,
        {},
        {
          withCredentials: true, // This ensures cookies are sent with the request
        }
      );
  
      // Check the response and dispatch action accordingly
      if (response.status === 200) {
        dispatch(updateFirstTimeStatus(false));  // Update the Redux state
        setShowEventSuggestion(false);  // Close the event suggestion
      }
  
    } catch (error) {
      console.error('Error updating status:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleCloseSuggestion = () => {
    setShowEventSuggestion(false);
    markAsNotFirstTime();
  };

  return (
    <div className=''>
      <Navbar />
      <Herosection />
      <ViewEvent />
      

      {showPopup && <RegisterPopup onClose={() => setShowPopup(false)} />}
      {showEventSuggestion && (
        <EventSuggestion
          close={handleCloseSuggestion}
          // Force re-render when closing
          key={Date.now()}
        />
      )}
      <Footer/>
    </div>
  );
};

export default Home;