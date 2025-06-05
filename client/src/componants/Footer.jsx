import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="end-0 mt-8  bg-orange-800 font-semibold text-orange-200 shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between p-3 py-10 md:flex-row">
        {/* <Link to="/">
          <h1 className="flex flex-wrap text-sm font-bold sm:text-xl">
            <span className="text-orange-200">IYADA</span>
            <span className="text-orange-300">Estate</span>
          </h1>
        </Link> */}

        <Link to="/">
          <img
            src="/../../assets/wimages/1v.svg"
            alt="Bio Market Berkane Logo"
            className="w-32"
          />
        </Link>
        {/* --------------socials-------------- */}
        <div>
          made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/ismail-iyada/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-orange-100"
          >
            Ismail IYADA
          </a>
        </div>
      </div>
    </div>
  );
}
