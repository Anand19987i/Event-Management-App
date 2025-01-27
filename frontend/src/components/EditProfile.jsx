import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { setLoading, setUserDetail } from "../redux/authSlice";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, loading, userDetail } = useSelector((store) => store.auth);
  const [profileImage, setProfileImage] = useState(userDetail?.avatar || "/default-pic.avif");
  const [input, setInput] = useState({
    mobile: userDetail?.mobile || "",
    firstname: userDetail?.firstname || "",
    lastname: userDetail?.lastname || "",
    address: userDetail?.address || "",
    avatar: userDetail?.avatar || null,
  });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    setInput({ ...input, avatar: file });
    setProfileImage(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("mobile", input.mobile);
    formData.append("firstname", input.firstname);
    formData.append("lastname", input.lastname);
    formData.append("address", input.address);
    if (input.avatar) {
      formData.append("avatar", input.avatar);
    }
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${USER_API_END_POINT}/edit/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setUserDetail(response.data.userDetail)); // Update Redux store
        console.log("Profile updated successfully");
        setProfileImage(response.data.userDetail.avatar || "/default-pic.avif"); // Update the profile image
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!user?._id) {
      console.error("User ID is undefined. API call skipped.");
      return;
    }

    const fetchUserDetail = async () => {
      try {
        const response = await axios.get(`${USER_API_END_POINT}/detail/${user._id}`, { withCredentials: true });
        if (response.data.success) {
          dispatch(setUserDetail(response.data.userDetail)); // Update Redux store with user details
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error.message);
      }
    };

    // Fetch user detail if it's not already available
    if (!userDetail) {
      fetchUserDetail();
    }
  }, [user, userDetail, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-purple-800" />
      </div>
    );
  }

  return (
    <div className="relative z-0">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 font-montserrat">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={submitHandler} className="mt-4 relative">
            <div>
              <img src="/banner.png" alt="Banner" className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-12">
                <label htmlFor="profile-image">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-lg cursor-pointer"
                  />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="avatar"
                  onChange={fileHandler}
                />
              </div>
            </div>
            <h2 className="text-2xl font-medium text-center mt-16 mb-6">Edit Profile</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="mobile"
                value={input.mobile}
                onChange={changeHandler}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={input.firstname}
                onChange={changeHandler}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter first name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={input.lastname}
                onChange={changeHandler}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter last name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={input.address}
                onChange={changeHandler}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter your address"
              />
            </div>
            <div className="flex justify-center mt-6">
              {loading ? (
                <button type="button" className="bg-purple-800 text-white py-3 px-6 rounded-2xl flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </button>
              ) : (
                <button type="submit" className="bg-purple-800 text-white px-6 py-3 rounded-2xl">
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
