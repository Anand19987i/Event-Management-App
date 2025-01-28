import React from 'react'
import { useSelector } from 'react-redux'
import HostNav from './HostNav';
import HeroSection from './HeroSection';
import MainSection from './MainSection';

const HostMain = () => {
    const {host} = useSelector(store => store.auth); 
    console.log(host?._id)
  return (
    <div>
      <HostNav/>
      <HeroSection/>
      <MainSection/>
    </div>
  )
}

export default HostMain
