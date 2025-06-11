import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Define a function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Create a new URLSearchParams object with the current URL's search string
    const urlParams = new URLSearchParams(location.search);

    // Set the "searchTerm" parameter in the URL's search string to the current search term
    urlParams.set("searchTerm", searchTerm);

    // Convert the URLSearchParams object back to a string
    const searchQuery = urlParams.toString();

    // Navigate to the search page with the updated search string
    navigate(`/search?${searchQuery}`);
  };

  // Use the useEffect hook to run a side effect after the component renders
  useEffect(() => {
    // Create a new URLSearchParams object with the current URL's search string
    const urlParams = new URLSearchParams(location.search);

    // Get the "searchTerm" parameter from the URL's search string
    const searchTermFromUrl = urlParams.get("searchTerm");

    // If there is a search term in the URL, set the current search term to it
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    // The side effect will run whenever the URL's search string changes
  }, [location.search]);

  return (
    <header className="bg-orange-200 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
        {/*
        <Link to="/">
          <h1 className="flex flex-wrap text-sm font-bold sm:text-xl">
            <span className="text-orange-500">IYADA</span>
            <span className="text-orange-700">Estate</span>
          </h1>
        </Link>
        */}
        <Link to="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/mern-estate-yada.appspot.com/o/17496028567031h.svg?alt=media&token=e599d625-2b32-47c6-af4d-03dc95425824"
            alt="Bio Market Berkane Logo"
            className="w-44"
          />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex items-center rounded-lg bg-orange-100 p-3"
        >
          <input
            type="text"
            name="search"
            id="search"
            className="w-24 bg-transparent focus:outline-none sm:w-64"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-orange-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden text-orange-700 hover:underline sm:inline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden text-orange-700 hover:underline sm:inline">
              About
            </li>
          </Link>
          {/**
           * // * If there is a currentUser, display the avatar.
           * // * If there is no currentUser, display "Sign In".
           * // * the profile page is a private route, so the user will
           * // ! be redirected to the sign-in page if they are not signed in.
           * // ? that logic is handled in the PrivateRoute component.
           */}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="h-7 w-7 rounded-full object-cover"
                src={currentUser.avatar}
                alt="Profile"
              />
            ) : (
              <li className="text-orange-700 hover:underline sm:inline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
