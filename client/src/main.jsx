import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  // ? The Provider component makes the Redux store available
  // ? to any nested components that need to access the Redux store.
  // ? The "store" prop is required and it is the Redux store created with createStore.

  <Provider store={store}>
    {
      // ? PersistGate is a component provided by redux-persist.
      // ? It delays the rendering of the app's UI until the persisted
      // ? state has been retrieved and saved to the Redux store.
      // ? The "loading" prop allows you to display a loading spinner
      // ? or any other placeholder component while the state is being rehydrated.
      // * When your application starts up again, redux-persist will take the state
      // * saved in the persistent storage and put it back into your Redux store.
      // * This process is known as "rehydration".
      // ? The "persistor" prop is the persistor object created using persistStore(store).
    }

    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
