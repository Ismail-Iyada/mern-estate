import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    // *****************************************card*****************************************
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg ">
      <Link to={`/listing/${listing._id}`} className="flex flex-col gap-4">
        <img
          src={
            listing.imageUrls[0] ||
            "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
          }
          alt="listing cover"
          className="transition-scale h-[320px] w-full object-cover duration-300 hover:scale-105 sm:h-[220px]"
        />
        <div className="flex  w-full flex-col gap-2 p-3">
          <p className="truncate text-lg font-semibold text-orange-700">
            {listing.title}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="w-full truncate text-sm text-gray-600">
              {listing.address}
            </p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {listing.description}
          </p>
          <p className="mt-2 font-semibold text-orange-500 ">
            ${" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && ""}
          </p>
          <div className="flex gap-4 text-orange-700">
            <div className="text-xs font-bold">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Quantity`
                : `${listing.bedrooms} Quantity`}
            </div>
            <div className="text-xs font-bold">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Units per Pack`
                : `${listing.bathrooms} Units per Pack`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
