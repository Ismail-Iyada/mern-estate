import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="end-0 mt-8  bg-slate-800 font-semibold text-slate-200 shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between p-3 py-10 md:flex-row">
        <Link to="/">
          <h1 className="flex flex-wrap text-sm font-bold sm:text-xl">
            <span className="text-slate-200">IYADA</span>
            <span className="text-slate-300">Estate</span>
          </h1>
        </Link>
        {/* --------------socials-------------- */}
        <div>
          made with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/ismail-iyada/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-100"
          >
            Ismail IYADA
          </a>
        </div>
      </div>
    </div>
  );
}
