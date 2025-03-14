import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Home from './Home'
import EditProfile from './components/EditProfile'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreateEvent from './main/CreateEvent'
import EventDetail from './Host/EventDetail'
import AIChat from './Host/AIChat'
import PersonalHostedEvents from './Host/PersonalHostedEvents'
import EditEventDetail from './Host/EditEventDetail'
import FabricCreation from './Host/FabricCreation'
import PersonalEventDetail from './Host/PersonalEventDetail'
import BookedEvents from './Host/BookedEvents/BookedEvents'
import BookedEventDetails from './Host/BookedEvents/BookedEventDetails'
import ChatBot from './components/ChatAssitant/ChatBot'
import HostLogin from './main/HostLogin'
import HostSignup from './main/HostSignup'
import HostMain from './main/HostMain'
import EditHostProfile from './main/EditHostProfile'
import SpecialEvent from './components/SpecialEvent'
import BookedEventDetail from './main/BookedEventDetail'
import SearchResults from './components/SearchResults'
import Dashboard from './main/Dashboard'
import SeatSelection from './main/SeatSelection'
import Success from './main/Success'
import ResetPassword from './auth/ResetPassword'
import OTPVerification from './auth/OTPVerification'

const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/login-as-host",
      element: <HostLogin/>
    },
    {
      path: "/signup-as-host",
      element: <HostSignup/>
    },
    {
      path: "/auth/otp/verify",
      element: <OTPVerification/>
    },
    {
      path: "/forgot-password",
      element: <ResetPassword/>
    },
    {
      path: "/edit/:name/:id",
      element: <EditProfile />
    },
    {
      path: "/edit-host/:name/:id",
      element: <EditHostProfile />
    },
    {
      path: "/host/event/:id",
      element: <CreateEvent />
    },
    {
      path: "/details/:eventTitle/:eventId",
      element: <EventDetail />
    },
    {
      path: "/details/v1/events/:eventTitle/:eventId",
      element: <PersonalEventDetail />
    },
    {
      path: "/ai/generate",
      element: <AIChat />
    },
    {
      path: "/list/events/:id",
      element: <PersonalHostedEvents />
    },
    {
      path: "/edit/event/:id",
      element: <EditEventDetail />
    },
    {
      path: "/create/v1/posters-and-thumbnails",
      element: <FabricCreation />
    },
    {
      path: "/list/bookings/events/:id",
      element: <BookedEvents />
    },
    {
      path: "/booked/event/details/:eventId",
      element: <BookedEventDetails />
    },
    {
      path: "/eventify/api/v1/ai-assistant/chatbot",
      element: <ChatBot />
    },
    {
      path: "/host/main",
      element: <HostMain/>
    },
    {
      path: "/view/events",
      element: <SpecialEvent/>
    },
    {
      path: "/no-of-bookings/:id",
      element: <BookedEventDetail/>
    },
    {
      path: "/search",
      element: <SearchResults />
    },
    {
      path: "/dashboard/:id",
      element: <Dashboard />
    }, 
    {
      path: "/seat-selection/:id",
      element: <SeatSelection />
    },
    {
      path: "/success",
      element: <Success />
    }
  ])
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
