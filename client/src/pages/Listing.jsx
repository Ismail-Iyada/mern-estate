import { set } from "mongoose";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// ! imports for swiper images slider
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
          console.log(data.message);
          return;
        }
        setLoading(false);
        setError(false);
        setListing(data);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.log(error.message);
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
        </>
      )}
    </main>
  );
}
