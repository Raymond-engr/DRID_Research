import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Search, Menu, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white h-max px-5 md:px-10 flex justify-between items-center">
        <Link href={"/"} className="py-3">
          <Image
            src="/logo-header.png"
            width={200}
            height={58}
            className="w-44 md:w-64"
            alt="Logo : DEPARTMENT OF RESEARCH, INNOVATION AND RESEARCH"
          />
        </Link>
        <div className="py-3 w-2/4 hidden md:block">
          <form className="w-full flex justify-end">
            <Input
              id="search-input"
              className="rounded-4xl focus:w-full w-52 transition-all text-gray-900"
              placeholder="Search..."
            />
            <label htmlFor="search-input" className="-ml-10 mt-1 text-sm">
              <Search className="text-gray-800 text-xs" />
            </label>
          </form>
        </div>
        {/* Hamburger Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop Navigation */}
      <div className="w-full px-5 md:px-10 bg-default py-3 h-10 sticky z-50 top-0 justify-center items-center hidden md:flex capitalize">
        <ul className="flex space-x-4 text-white items-center">
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="hover:text-gray-400">
                    HOME
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to the home page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/research" className="hover:text-gray-400">
                    RESEARCH AT UNIBEN
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Our Research</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/innovation" className="hover:text-gray-400">
                    INNOVATION
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Our Innovations</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/development" className="hover:text-gray-400">
                    DEVELOPMENT
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Developments from the DRID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/research-news" className="hover:text-gray-400">
                    RESEARCH NEWS
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Latest research news</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/partnerships" className="hover:text-gray-400">
                    PARTNERSHIPS
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Our partnerships</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="w-full px-5 bg-default py-3 flex flex-col space-y-4 text-white md:hidden capitalize">
          {/* Search Field */}
          <form className="w-full flex justify-center mb-4">
            <Input
              id="mobile-search-input"
              className="rounded-4xl w-full text-white"
              placeholder="Search..."
            />
            <label
              htmlFor="mobile-search-input"
              className="-ml-10 mt-1 text-sm"
            >
              <Search className="text-gray-800 text-xs" />
            </label>
          </form>
          {/* Navigation Links */}
          <Link href="/" className="hover:text-gray-400">
            HOME
          </Link>
          <Link href="/research" className="hover:text-gray-400">
            RESEARCH AT UNIBEN
          </Link>
          <Link href="/innovation" className="hover:text-gray-400">
            INNOVATION
          </Link>
          <Link href="/development" className="hover:text-gray-400">
            DEVELOPMENT
          </Link>
          <Link href="/research-news" className="hover:text-gray-400">
            RESEARCH NEWS
          </Link>
          <Link href="/partnerships" className="hover:text-gray-400">
            PARTNERSHIPS
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
