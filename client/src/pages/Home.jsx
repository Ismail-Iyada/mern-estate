import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../componants/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation, Autoplay, Pagination]);

  // console.log(saleListings);
  // console.log(rentListings);
  // console.log(offerListings);
  useEffect(() => {
    // ! step by step fetching, offer > rent > sale
    // * thats why we call fetchRentListings inside fetchOfferListings,
    // * and fetchSaleListings inside fetchRentListings

    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListingss();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListingss = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top / landing*/}
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-28">
        <h1 className="text-3xl font-bold text-slate-700 lg:text-6xl">
          Find your next <span className="text-slate-500">Perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-xs text-gray-400 sm:text-sm">
          3yada Estate is the best place to find your next perfect place to
          live. <br /> We have a wide range of properties for sale and rent.
        </div>
        <Link
          className="text-xs font-bold text-blue-800 underline sm:text-sm"
          to="/search"
        >
          Let's get Started
        </Link>
      </div>
      {/* Swiper */}
      <Swiper
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <Link to={`/listing/${listing._id}`}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                  key={listing._id}
                ></div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing results for offer, rent , sale */}
      <div className="mx-auto my-10 flex max-w-6xl flex-col gap-8 p-4">
        {/* ****************offer********************** */}
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold">Recent offers</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={`/search?offer=true`}
              >
                Show more offers
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem
                  className="max-w-sm"
                  key={listing._id}
                  listing={listing}
                />
              ))}
            </div>
          </div>
        )}
        {/* ****************rent********************** */}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold">Recent places for rent</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={`/search?type=rent`}
              >
                Show places for rent
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  className="max-w-sm"
                  key={listing._id}
                  listing={listing}
                />
              ))}
            </div>
          </div>
        )}
        {/* ****************sale********************** */}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold">Recent places for sale</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={`/search?type=sale`}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-4">
              {saleListings.map((listing) => (
                <ListingItem
                  className="max-w-sm"
                  key={listing._id}
                  listing={listing}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
