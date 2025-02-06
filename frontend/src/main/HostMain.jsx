import React from 'react'
import { useSelector } from 'react-redux'
import HostNav from './HostNav';
import HeroSection from './HeroSection';
import MainSection from './MainSection';
import Footer from '@/components/Footer';

const HostMain = () => {
    const {host} = useSelector(store => store.auth); 
    console.log(host?._id)
  return (
    <div>
      <HostNav/>
      <HeroSection/>
      <MainSection/>
      <Footer/>
    </div>
  )
}

export default HostMain
