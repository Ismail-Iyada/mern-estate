import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// ! imports for swiper images slider
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  FaBoxes,
  FaBoxOpen,
  FaCubes,
  FaMapMarkerAlt,
  FaShare,
  FaTruckPickup,
} from "react-icons/fa";
import Contact from "../componants/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          // console.log(data.message);
          return;
        }
        setLoading(false);
        setError(false);
        setListing(data);
      } catch (error) {
        setLoading(false);
        setError(true);
        // console.log(error.message);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {/* --------------------------loading --------------------- */}
      {loading && <p className="my-7 text-center text-2xl">Loading...</p>}
      {/* --------------------------ERROR --------------------- */}
      {error && (
        <p className="my-7 text-center text-2xl">Error fetching listing</p>
      )}
      {/* --------------------------LISTING --------------------- */}
      {listing && !loading && !error && (
        <>
          {/* -------------- swiper / slider */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* share link button---------------------------- */}
          <div className="fixed right-[3%] top-[13%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-orange-100">
            <FaShare
              className="text-orange-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {/* link copied pop up----------------------------- */}
          {copied && (
            <p className="fixed right-[5%] top-[23%] z-10 rounded-md bg-orange-100 p-2">
              Link copied!
            </p>
          )}
          <div className="mx-auto flex max-w-4xl flex-col gap-4 p-3 py-10 sm:py-20">
            <p className="text-2xl font-semibold">
              {listing.title} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && ""}
            </p>
            <p className="mt-6  flex items-center gap-2 text-sm text-orange-600">
              <FaMapMarkerAlt className="text-green-700" /> {listing.address}
            </p>
            <div className="flex flex-wrap gap-4">
              <p className="w-full max-w-[200px] rounded-md bg-red-900 p-1 text-center text-white">
                {listing.type === "rent" ? "Accessories" : "Food & Beverages"}
              </p>
              {listing.offer && (
                <p className="w-full max-w-[200px] rounded-md bg-green-900 p-1 text-center text-white">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </p>
              )}
            </div>
            <p className="text-orange-800">
              <span className="font-semibold text-black">Description — </span>
              {listing.description}
            </p>
            <ul className="my-4 flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBoxes className="text-lg text-green-700" />{" "}
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Quantity`
                  : `${listing.bedrooms} Quantity`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaCubes className="text-lg text-green-700" />{" "}
                {listing.bathrooms > 1
                  ? `${listing.bathrooms}  Units per Pack`
                  : `${listing.bathrooms}  Units per Pack`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaTruckPickup className="text-lg text-green-700" />{" "}
                {listing.parking ? `Pickup Available` : `Not Pickup Available`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBoxOpen className="text-lg text-green-700" />{" "}
                {listing.furnished
                  ? `Packaged / Ready to use`
                  : `Not Packaged / Ready to use`}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="rounded-lg bg-orange-700 p-3 uppercase text-white hover:opacity-95"
              >
                Contact seller
              </button>
            )}
            {currentUser && listing.userRef !== currentUser._id && contact && (
              <Contact listing={listing} />
            )}
          </div>
        </>
      )}
    </main>
  );
}
