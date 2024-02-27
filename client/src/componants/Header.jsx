import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-3">
        <Link to="/">
          <h1 className="flex flex-wrap text-sm font-bold sm:text-xl">
            <span className="text-slate-500">IYADA</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="flex items-center rounded-lg bg-slate-100 p-3">
          <input
            type="text"
            name="search"
            id="search"
            className="w-24 bg-transparent focus:outline-none sm:w-64"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden text-slate-700 hover:underline sm:inline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden text-slate-700 hover:underline sm:inline">
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
              <li className="text-slate-700 hover:underline sm:inline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
