import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  /**
   * * If there is a currentUser, display the profile page,
   * ! that is the "Outlet / child" of PrivateRoute in the App.jsx.
   * * If there is no currentUser, redirect to the sign-in page.
   */
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
