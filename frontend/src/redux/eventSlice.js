// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  eventId: null,
  eventDetail: {},
  singleEvent: {},
  userEvents: [],
  userEventDetail: {},
  recommendEvents: [],
  bookedEvents: [],
  dashboardEvents: [],
  checkBooked: false,
  loading: false,
  error: null,
};


const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setEventId: (state, action) => {
      state.eventId = action.payload;
    },
    setEventDetail: (state, action) => {
      state.eventDetail = action.payload;
    },
    setRecommendEvents: (state, action) => {
      state.recommendEvents  = action.payload;
    },
    setSingleEvent: (state, action) => {
        state.singleEvent = action.payload;
    },
    setUserEvents: (state, action) => {
      state.userEvents = action.payload;
    },
    setUserEventDetail: (state, action) => {
      state.userEventDetail = action.payload;
    },
    setBookedEvents: (state, action) => {
      state.bookedEvents = action.payload;
    },
    setDashboardEvents: (state, action) => {
      state.dashboardEvents = action.payload;
    },
    setCheckBooked: (state, action) => {
      state.checkBooked = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {setEvents, setEventId, setEventDetail, setRecommendEvents, setSingleEvent, setUserEvents, setUserEventDetail, setBookedEvents, setDashboardEvents, setCheckBooked, setLoading, setError } = eventSlice.actions;

export default eventSlice.reducer;
