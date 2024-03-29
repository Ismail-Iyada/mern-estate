import { createSlice } from "@reduxjs/toolkit";

// ! In Redux Toolkit, the state is managed by a Redux store.
// ! When you define a reducer using the createSlice function,
// ! Redux Toolkit automatically generates action creators for you.
// ! These action creators are functions that you can call to dispatch actions to the store.

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

/**
 * ? Redux slice for managing user state.
 *
 * UserSlice
 * * name - The name of the slice.
 * * initialState - The initial state of the slice.
 * * reducers - The reducer functions for handling state updates.
 */

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ! signInStart is an action creator generated by Redux Toolkit.
    // ! It takes the state as a parameter, which represents the current
    // ! state of the Redux store. You don't need to pass the state
    // ! explicitly when calling this action creator. Instead, Redux
    // ! Toolkit will automatically pass the current state to the
    // ! action creator when it is dispatched.

    /**
     * ? Reducer function for handling the start of user sign-in.
     *
     * * state - The current state of the slice.
     */
    signInStart: (state) => {
      state.loading = true;
    },

    /**
     * ? Reducer function for handling successful user sign-in.
     *
     * * state - The current state of the slice.
     * * action - The action object containing the payload.
     * * action.payload - The payload data for the sign-in success.
     */
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * ? Reducer function for handling failed user sign-in.
     *
     * * state - The current state of the slice.
     * * action - The action object containing the payload.
     * * action.payload - The payload data for the sign-in failure.
     */
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} = userSlice.actions;

export default userSlice.reducer;

// * Dispatching the action
// ?-------------------------------------------dispatch(actions.signInStart());
// ! In this example, dispatch is a function provided by Redux that you can use to dispatch actions to the store. When you call actions.signInStart(), Redux Toolkit will automatically pass the current state to the signInStart action creator, and the reducer will update the loading property of the state to true.

// ! Remember that Redux Toolkit simplifies the process of managing state in Redux by providing a set of utilities, including the createSlice function. It's a great choice for beginners to Redux as it reduces boilerplate code and makes state management easier to understand.
