import { set } from "mongoose";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../componants/ListingItem";
import Pagination from "../componants/Pagination";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // ! get the query params from the url
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    // ! if the query params are present in the url, set the state to the query params

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setShowMore(false);
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    // * the form input could be devided into 4 types
    // ! predifined values (all, rent, sale)
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({
        ...sidebarData,
        type: e.target.id,
      });
    }
    // ! text value (searchTerm)
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    // ! boolean values (parking, furnished, offer)
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.id === "true" ? true : false,
      });
    }
    // ! select value (sort_order)
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({
        ...sidebarData,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // TODO: change the show more functionality into a pagination
  // ! This function is triggered when the "Show More" button is clicked.
  const onShowMoreClick = async () => {
    // * Get the current number of listings
    const numberOfListings = listings.length;
    // * Set the start index for the next batch of listings to the current number of listings
    const startIndex = numberOfListings;
    // * Create a new URLSearchParams object with the current search parameters
    const urlParams = new URLSearchParams(location.search);
    // * Add the start index to the search parameters
    urlParams.set("startIndex", startIndex);
    // * Convert the search parameters to a string
    const searchQuery = urlParams.toString();
    // * Fetch the next batch of listings from the server
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    // * Convert the response to JSON
    const data = await res.json();
    // ! If the number of listings returned is less than 9, hide the "Show More" button
    if (data.length < 9) {
      setShowMore(false);
    } else {
      // ! If the number of listings returned is 9 or more, keep the "Show More" button visible
      setShowMore(true);
    }
    // ! Add the new listings to the existing listings
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className=" border-b-2 p-7 shadow md:min-h-screen md:max-w-sm md:border-b-0 md:border-r-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* ----------------Search Term----------------- */}
          <div className="flex  flex-wrap items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="w-full rounded-lg border p-3"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          {/* ----------------Type------------------------ */}
          <div className="flex  flex-wrap  items-center gap-2">
            <label className="min-w-24 font-semibold">Type:</label>
            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                />
                <label htmlFor="all">All Products</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "rent"}
                />
                <label htmlFor="rent">Food & Beverages</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.type === "sale"}
                />
                <label htmlFor="sale">Accessories</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.offer}
                />
                <label htmlFor="offer">Special Offers</label>
              </div>
            </div>
          </div>
          {/* ----------------Amenition------------------- */}
          <div className="flex  flex-wrap  items-center gap-2">
            <label className="min-w-24 font-semibold">Product features:</label>
            <div className="flex flex-wrap gap-5">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.parking}
                />
                <label htmlFor="parking">Locally Sourced</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebarData.furnished}
                />
                <label htmlFor="furnished">Handmade</label>
              </div>
            </div>
          </div>
          {/* ----------------Sort------------------------ */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="min-w-24 font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              id="sort_order"
              className="rounded-lg border p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          {/* ----------------Search Button--------------- */}
          <button className="rounded-lg bg-orange-700 p-3 font-semibold uppercase text-white hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="mt-5 border-b p-3 text-3xl font-semibold text-orange-700 shadow-sm">
          Marketplace results:
        </h1>
        <div className="p-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-orange-700">No matching results</p>
          )}
          {loading && (
            <p className="w-full text-center text-xl text-orange-700">
              Loading...
            </p>
          )}
          {/* ********************************cards list******************************* */}
          {!loading && listings && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ">
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}{" "}
            </div>
          )}
        </div>
        {/* --------------Show More---------------- */}
        <div className="flex justify-end p-7">
          {showMore && (
            <button
              className="w-52 border-t-2 border-orange-700 p-7 pe-0 text-right text-green-700 hover:underline md:w-96"
              onClick={onShowMoreClick}
            >
              show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
