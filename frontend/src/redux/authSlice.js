// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  host: null,
  token: null,
  userDetail: "",
  isFirstTime: false,  // Added proper initialization
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Sync isFirstTime with user data
      state.isFirstTime = action.payload?.isFirstTime ?? false;
    },
    setHost: (state, action) => {
      state.host = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    // New reducer for updating first time status
    updateFirstTimeStatus: (state, action) => {
      if (state.user) {
        state.user.isFirstTime = action.payload;
        state.isFirstTime = action.payload;
      }
    },
  },
});

export const { 
  setUser, 
  setHost,
  setToken, 
  setUserDetail, 
  setLoading, 
  setError,
  updateFirstTimeStatus  // Export new action
} = authSlice.actions;

export default authSlice.reducer;