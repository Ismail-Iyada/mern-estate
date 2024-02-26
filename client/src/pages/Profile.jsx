// Importing necessary dependencies
import { useSelector } from "react-redux"; // Importing the useSelector hook from react-redux to access the Redux store
import { useRef, useState, useEffect } from "react"; // Importing the useRef, useState, and useEffect hooks from react
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // Importing functions from the firebase/storage module
import { app } from "../firebase"; // Importing the firebase app instance
import {
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice"; // Importing the action creators from the userSlice
import { useDispatch } from "react-redux"; // Importing the useDispatch hook from react-redux to dispatch actions to the Redux store
import { set } from "mongoose";

// Defining the Profile component
export default function Profile() {
  // Creating necessary state variables and refs
  const fileRef = useRef(null); // Creating a ref to the file input element
  const { loading, currentUser, error } = useSelector((state) => state.user); // Accessing the currentUser object from the Redux store
  const [file, setFile] = useState(undefined); // Creating a state variable to store the selected file
  const [filePercentage, setFilePercentage] = useState(0); // Creating a state variable to store the upload progress percentage
  const [fileUploadError, setFileUploadError] = useState(false); // Creating a state variable to indicate if there was an error during file upload
  const [formData, setFormData] = useState({}); // Creating a state variable to store form data
  const [updateSucess, setUpdateSuccess] = useState(false); // Creating a state variable to indicate if the update was successful
  const [inputChange, setInputChange] = useState(false); // Creating a state variable to indicate if the input fields have changed
  const dispatch = useDispatch(); // Creating a dispatch function to dispatch actions to the Redux store

  // useEffect hook to handle file upload when the file state variable changes
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  //--------------------------------- Function to handle file upload--------------------------------------------------
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // Getting the storage instance from the firebase app
    const fileName = new Date().getTime() + "-" + file.name; // Generating a unique file name using the current timestamp and original file name
    const storageRef = ref(storage, fileName); // Creating a reference to the storage location with the generated file name
    const uploadTask = uploadBytesResumable(storageRef, file); // Creating an upload task to upload the file to the storage location

    // Event listener for upload task state changes
    uploadTask.on(
      // ! Listening for the "state_changed" event to track the upload progress
      // * The event listener receives three functions as arguments: next, error, and complete
      "state_changed",
      // ? next: A function that is called on each state change
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculating the upload progress percentage
        setFilePercentage(Math.round(progress)); // Updating the filePercentage state variable with the rounded progress value
      },
      // ? error: A function that is called if there is an error during upload
      (error) => {
        setFileUploadError(true); // Setting the fileUploadError state variable to true if there was an error during upload
      },
      // ? complete: A function that is called when the upload is complete
      () => {
        // Once the upload is complete, getting the download URL of the uploaded file
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL }); // Updating the formData state variable with the download URL of the uploaded file
          setInputChange(true);
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  //--------------------------------- Function to handle form input changes-------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (
      e.target.id === "username" ||
      e.target.id === "email" ||
      e.target.id === "password"
    ) {
      setInputChange(true);
    }
  };
  //--------------------------------- Function to handle form submission----------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart()); // Dispatching the updateUserStart action to update the user profile

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data)); // Dispatching the updateUserSuccess action with the updated user data
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  //--------------------------------- Function to handle user deletion------------------------------------------------
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  //--------------------------------- Function to handle user sign out-------------------------------------------------
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

  // Rendering the Profile component
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])} // Updating the file state variable with the selected file
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()} // Triggering the file input click event when the image is clicked
          src={formData.avatar || currentUser.avatar} // Displaying the avatar image from the formData or the currentUser object
          alt="profile"
          className="rounded-full self-center h-24 w-24 object-cover cursor-pointer"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (image must be less than 2mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading Image ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="User Name"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading || !inputChange}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSucess ? "User is updated successfully" : ""}
      </p>
    </div>
  );
}
