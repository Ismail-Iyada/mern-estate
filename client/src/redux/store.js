import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ! Combining all reducers into a single rootReducer
const rootReducer = combineReducers({ user: userReducer });

// ! Configuration for Redux Persist
const persistConfig = {
  key: "root", // * Key used to store the persisted state
  storage, // * Storage engine used to persist the state (in this case, localStorage)
  version: 1, // * Version of the persisted state
};

// ! Creating a persisted reducer using the persistReducer function
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ! Creating the Redux store with the persisted reducer and additional configuration
export const store = configureStore({
  reducer: persistedReducer, // * Root reducer used by the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ? Disabling the serializable check for Redux Toolkit
    }),
});

// ! Creating the persistor to persist the Redux store
export const persistor = persistStore(store);
