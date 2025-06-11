import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className=" mx-auto max-w-6xl px-4 py-20">
      <h1 className="mb-4 flex items-end text-2xl font-bold text-orange-800 sm:text-3xl">
        About{" "}
        <Link to="/">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/mern-estate-yada.appspot.com/o/17496028567031h.svg?alt=media&token=e599d625-2b32-47c6-af4d-03dc95425824"
            alt="Bio Market Berkane Logo"
            className="inline-block w-44"
          />
        </Link>
      </h1>
      <h3 className="m-2">
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/ismail-iyada/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-orange-950"
        >
          Ismail IYADA
        </a>
      </h3>
      <p className="mb-4 text-orange-700">
        Bio Market Berkane is your trusted destination for natural and organic
        Moroccan products. Our mission is to support local farmers and artisans
        by offering you authentic, high-quality goods—from healthy foods and
        natural cosmetics to everyday wellness essentials.
      </p>
      <p className="mb-4 text-orange-700">
        We believe in simple, transparent shopping that connects you directly
        with the best that Morocco has to offer. Every item on our platform is
        carefully selected to meet your needs for freshness, quality, and
        sustainability.
      </p>
      <p className="mb-4 text-orange-700">
        Whether you're shopping for your home or looking for unique local
        products, Bio Market Berkane brings you a smooth, secure, and
        multilingual shopping experience, available in French, English, and
        Arabic.
      </p>
    </div>
  );
}
