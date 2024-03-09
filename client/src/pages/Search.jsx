import React from "react";

export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b-2 p-7 shadow md:min-h-screen md:max-w-sm md:border-b-0 md:border-r-2">
        <form className="flex flex-col gap-8">
          {/* ----------------Search Term----------------- */}
          <div className="flex items-center gap-2">
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
            />
          </div>
          {/* ----------------Type------------------------ */}
          <div className="flex flex-nowrap items-center gap-2">
            <label className="min-w-24 font-semibold">Type:</label>
            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex gap-2">
                <input type="checkbox" id="all" className="w-5" />
                <label htmlFor="all">Rent & Sale</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                <label htmlFor="sale">Sale</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5" />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>
          </div>
          {/* ----------------Amenition------------------- */}
          <div className="flex flex-nowrap items-center gap-2">
            <label className="min-w-24 font-semibold">Amenitites:</label>
            <div className="flex flex-wrap gap-5">
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                <label htmlFor="parking">Parking</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                <label htmlFor="furnished">Furnished</label>
              </div>
            </div>
          </div>
          {/* ----------------Sort------------------------ */}
          <div className="flex items-center gap-2">
            <label className="min-w-24 font-semibold">Sort:</label>
            <select id="sort_order" className="rounded-lg border p-3">
              <option value="">Price high to low</option>
              <option value="">Price low to high</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          {/* ----------------Search Button--------------- */}
          <button className="rounded-lg bg-slate-700 p-3 font-semibold uppercase text-white hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="mt-5 border-b p-3 text-3xl font-semibold text-slate-700">
        <h1>Listings results:</h1>
      </div>
    </div>
  );
}
