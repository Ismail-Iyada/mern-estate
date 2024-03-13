import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          // console.log(data.message);
          return;
        }
        setLandlord(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.title.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full rounded-lg border p-3"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter your message here..."
          ></textarea>
          <Link
            className="rounded-lg bg-slate-700 p-3 text-center uppercase text-white hover:opacity-95"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.title}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
