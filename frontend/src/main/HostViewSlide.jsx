import { LogOut, Pen } from 'lucide-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { TbBrandBooking } from "react-icons/tb";
import { MdEventAvailable } from "react-icons/md";
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setToken, setUser, setUserDetail } from '../redux/authSlice';
import { TbSettingsAutomation } from "react-icons/tb";

const HostViewSlide = () => {
    const { host, token, userDetail } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const Logout = async () => {
        try {
            const response = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (response.data.success) {
                console.log("Logout");
                dispatch(setUser(null));
                dispatch(setUserDetail(""));
                dispatch(setToken(null));
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col w-full font-montserrat shadow-lg border bg-white relative z-100'>
            <div className='flex justify-between border-b items-center p-4'>
                <span className='text-2xl font-semibold'>Hey!</span>
                <img src={userDetail?.avatar || "/default-pic.avif"} alt="User Avatar" className='w-14 h-14 rounded-full' />
            </div>
            <Link to={`/edit-host/${host?.name}/${host?._id}`}>
                <div className='border-b gap-3 px-4 py-6 cursor-pointer hover:bg-gray-100'>
                    <div className="flex justify-start items-center gap-3 ">
                        <Pen className='w-4 h-4' />
                        <span className='text-lg'>Edit Profile</span>
                    </div>
                    <div>
                        <p className='text-sm pl-7 text-gray-500'>Edit your personal details</p>
                    </div>
                </div>
            </Link>
            <Link to={`/host/event/${host?._id}`}> <div className='border-b gap-3 px-4 py-6 cursor-pointer hover:bg-gray-100'>
                <div className="flex justify-start items-center gap-3 ">
                    <MdEventAvailable className='w-4 h-4' />
                    <span className='text-lg'>Host Your Events</span>
                </div>
                <div>
                    <p className='text-sm pl-7 text-gray-500'>Organize events and shows</p>
                </div>
            </div>
            </Link>
            <div className='border-b flex items-center justify-start gap-3 px-4 py-6 cursor-pointer hover:bg-gray-100'>
                <LogOut className='w-4 h-4' />
                <span className='text-lg text-red-500' onClick={Logout}>Sign Out</span>
            </div>
        </div>
    );
}

export default HostViewSlide;
