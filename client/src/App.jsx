import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Header from "./componants/Header";
import PrivateRoute from "./componants/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import { useEffect } from "react";
import Footer from "./componants/Footer";

// * The ScrollToTop component is used to scroll to the top of the page when the URL changes.
// ! created it cz i cant use (uselocation) hook in the App
// ! component cz it's not a route component (the parent must be BrowserRouter).
function ScrollToTop() {
  // * The useLocation hook returns the location object that represents the current URL.
  const { pathname } = useLocation();
  // * The useEffect hook is used to scroll to the top of the page when the URL changes.
  // ? did this cz i noticed that the page was not scrolling to the top when i clicked on a link!!
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:listingId" element={<Listing />} />
        {/**
         * // * The profile page is a private route, so the user will
         * // ! be redirected to the sign-in page if they are not signed in.
         * // ? that logic is handled in the PrivateRoute component.
         */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-product" element={<CreateListing />} />
          <Route
            path="/update-product/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
