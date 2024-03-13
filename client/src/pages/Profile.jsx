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
import { Link } from "react-router-dom";

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
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]); // Creating a state variable to store the user's listings
  const [showListings, setShowListings] = useState(false); // Creating a state variable to indicate if the user's listings should be shown
  const [loadListings, setLoadListings] = useState(false); // Creating a state variable to indicate if the user's listings should be loaded
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
          // console.log("File available at", downloadURL);
        });
      },
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

  //--------------------------------- Function to handle show listings-------------------------------------------------
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      setLoadListings(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      setShowListings(!showListings);
      setLoadListings(false);
    } catch (error) {
      setShowListingsError(true);
      setLoadListings(false);
    }
  };

  //--------------------------------- Function to handle listing deletion-------------------------------------------------
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        // console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        // ? get every listing except the one that was deleted "listingId"
        prev.filter((listing) => listing._id !== listingId),
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  // Rendering the Profile component
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
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
          className="h-24 w-24 cursor-pointer self-center rounded-full object-cover"
        />
        <p className="self-center text-sm">
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
          className="rounded-lg border p-3"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="rounded-lg border p-3"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="rounded-lg border p-3"
          onChange={handleChange}
        />
        <button
          disabled={loading || !inputChange}
          className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="rounded-lg bg-green-700 p-3 text-center uppercase text-white hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="mt-5 flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer text-red-700"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer text-red-700">
          Sign out
        </span>
      </div>
      <p className="mt-5 text-red-700">{error ? error : ""}</p>
      <p className="mt-5 text-green-700">
        {updateSucess ? "User is updated successfully" : ""}
      </p>
      <button
        disabled={loadListings}
        onClick={handleShowListings}
        className="w-full rounded-lg border border-slate-300 py-3 text-green-700 hover:border-green-700 disabled:opacity-90  "
      >
        {loadListings
          ? "Loading..."
          : showListings && userListings && userListings.length > 0
            ? "Hide Listings"
            : "Show Listings"}
      </button>
      <p className="mt-5 text-red-700">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {showListings && userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="my-7 text-center text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <Link
                className="flex flex-1 items-center justify-between gap-4"
                to={`/listing/${listing._id}`}
              >
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 rounded-lg object-contain"
                />
                <p className="flex-1 truncate font-semibold text-slate-700 hover:underline">
                  {listing.title}
                </p>
              </Link>
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleListingDelete(listing._id)}
                  className="uppercase text-red-700"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button type="button" className="uppercase text-green-700">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
