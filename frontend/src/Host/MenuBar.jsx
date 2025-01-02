import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const MenuBar = () => {
    const { user } = useSelector((store) => store.auth);
    return (
        <div className='h-11 gap-10 bg-gray-100 flex items-center px-20 text-[10px] font-poppins text-gray-900 md:text-sm'>
            <Link to="/ai/generate"><span>Automated Contents</span></Link>
            <Link to="/create/v1/posters-and-thumbnails"><span>Create Posters & Thumbnails</span></Link>
            <span>Check Account Details</span>
            <Link to={`/list/events/${user._id}`}><span>List of Your Events</span></Link>
        </div>
    )
}

export default MenuBar
