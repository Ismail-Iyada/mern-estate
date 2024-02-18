import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"; // Importing necessary functions from the 'firebase/auth' module.
import { app } from "../firebase"; // Importing the firebase app instance.
import { useDispatch } from "react-redux"; // Importing the useDispatch hook from 'react-redux' library.
import { signInSuccess } from "../redux/user/userSlice"; // Importing the signInSuccess action from the userSlice file.
import { useNavigate } from "react-router-dom"; // Importing the useNavigate hook from 'react-router-dom' library.

export default function OAuth() {
  const dispatch = useDispatch(); // Initializing the useDispatch hook.
  const navigate = useNavigate(); // Initializing the useNavigate hook.

  const handleGoogleClick = async () => {
    // Defining an asynchronous function handleGoogleClick.
    try {
      const provider = new GoogleAuthProvider(); // Creating a new instance of GoogleAuthProvider.
      // ! getAuth is a function from the 'firebase/auth' module.
      // ! and app is the firebase app instance.
      const auth = getAuth(app); // Initializing the auth variable with the result of getAuth function.

      const result = await signInWithPopup(auth, provider); // Signing in with Google using signInWithPopup function.

      const res = await fetch("/api/auth/google", {
        // Sending a POST request to the '/api/auth/google' endpoint.
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json(); // Parsing the response as JSON.
      dispatch(signInSuccess(data)); // Dispatching the signInSuccess action with the data received from the server.
      navigate("/"); // Navigating to the home page.
    } catch (error) {
      console.log("could not sign in with google", error); // Logging an error message if sign in with Google fails.
    }
  };

  return (
    <button
      onClick={handleGoogleClick} // Attaching the handleGoogleClick function to the button's onClick event.
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}
