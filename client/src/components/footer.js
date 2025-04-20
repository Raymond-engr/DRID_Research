import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-fuchsia-900 text-white text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-20 py-12 bg-fuchsia-800">
        {/* PUBLISHED WORK */}
        <div>
          <h4 className="font-bold text-white uppercase mb-3 border-b-2 border-fuchsia-900 w-fit">
            Published Work
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/research" className="hover:text-white">
                Research
              </Link>
            </li>
            <li>
              <Link href="/innovation" className="hover:text-white">
                Innovation Digest
              </Link>
            </li>
            <li>
              <Link href="development" className="hover:text-white">
                Development
              </Link>
            </li>
          </ul>
        </div>

        {/* CONNECT WITH US */}
        <div>
          <h4 className="font-bold text-white uppercase mb-3 border-b-2 border-fuchsia-900 w-fit">
            Connect with Us
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link
                href="https://web.facebook.com/UnibenPRO"
                target="_blank"
                className="hover:text-white"
              >
                Facebook
              </Link>
            </li>
            <li>
              <Link
                href="https://twitter.com/UniversityofBen"
                target="_blank"
                className="hover:text-white"
              >
                Twitter (X)
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white" target="_blank">
                LinkedIn
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white" target="_blank">
                YouTube
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white" target="_blank">
                Instagram
              </Link>
            </li>
          </ul>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h4 className="font-bold text-white uppercase mb-3 border-b-2 border-fuchsia-900 w-fit">
            Useful Links
          </h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="https://uniben.edu/" className="hover:text-white">
                UNIBEN Main Site
              </Link>
            </li>
            <li>
              <Link href="mailto:drid@uniben.edu" className="hover:text-white">
                Contact DRID
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-fuchsia-950 text-center text-gray-300 py-4 px-4 md:px-20 text-xs md:text-sm flex flex-col md:flex-row items-center justify-between">
        <span>
          © {new Date().getFullYear()} Directorate of Research, Innovation &
          Development, University of Benin
        </span>
        <span className="mt-2 md:mt-0">Crafted with 💡 by the DRID Team</span>
      </div>
    </footer>
  );
};

export default Footer;
