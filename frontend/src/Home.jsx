import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Cities from './components/Cities'
import Herosection from './components/Herosection'
import ViewSlide from './components/ViewSlide'
import SpecialEvent from './components/SpecialEvent'
import Optionbar from './components/Optionbar'
import ViewEvent from './Host/ViewEvent'
import { useSelector } from 'react-redux'
import RegisterPopup from './components/RegisterPopup'

const Home = () => {
  const { user } = useSelector(store => store.auth);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user?._id) {
      const timer = setTimeout(() => {
        setShowPopup(true);  
      }, 10000)  
      return (() => clearTimeout(timer));
    }
  }, [user]);
  return (
    <div className=''>
      <Navbar/>
      {/* <Optionbar/> */}
      <Herosection/>
     <ViewEvent/>
     {showPopup && <RegisterPopup onClose={(() => setShowPopup(false))}/>}
    </div>
  )
}

export default Home
