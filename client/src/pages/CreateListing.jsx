import React from "react";

export default function CreateListing() {
  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            className="rounded-lg border p-3"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="Description"
            className="rounded-lg border p-3"
            required
          />
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address"
            className="rounded-lg border p-3"
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" name="sale" id="sale" className="w-5" />
              <label htmlFor="sale">Sell</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="rent" id="rent" className="w-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className="w-5"
              />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" name="offer" id="offer" className="w-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                id="bedrooms"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
              />
              <label
                htmlFor="regularPrice"
                className="flex flex-col items-center"
              >
                <span>Regular price</span>
                <span className="text-sm">($ / month)</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="discountPrice"
                id="discountPrice"
                className="rounded-lg border border-gray-300 p-3"
                min={1}
                max={10}
                required
              />
              <label
                htmlFor="discountPrice"
                className="flex flex-col items-center"
              >
                <span>Discounted price</span>
                <span className="text-sm">($ / month)</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold ">
            Images:
            <span className="ml-2 font-normal text-gray-500">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 ">
            <input
              className="w-full rounded border border-gray-300 p-3"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="rounded border border-green-700 p-3 uppercase text-green-700 hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
