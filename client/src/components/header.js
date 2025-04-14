import Image from "next/image";
import Link from "next/link";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = () => {
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
        <div className="py-3 w-2/4">
          <form className="w-full flex justify-end">
            <Input
              id="search-input"
              className="rounded-4xl focus:w-full w-52 transition-all text-black"
              placeholder="Search..."
            />
            <label htmlFor="search-input" className="-ml-10 mt-1 text-sm">
              <Search className="text-gray-800 text-xs" />
            </label>
          </form>
        </div>
      </header>
      <div className="w-full px-5 md:px-10 bg-default py-3 h-10 sticky top-0 justify-center items-center hidden md:flex capitalize">
        <ul className="flex space-x-4 text-white items-center">
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="text-gray-800 hover:text-gray-400">
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
                  <Link
                    href="/about"
                    className="text-gray-800 hover:text-gray-400"
                  >
                    ABOUT US
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn about DRID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
          <li>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/research"
                    className="text-gray-800 hover:text-gray-400"
                  >
                    RESEARCH
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
                  <Link
                    href="/innovation"
                    className="text-gray-800 hover:text-gray-400"
                  >
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
                  <Link
                    href="/development"
                    className="text-gray-800 hover:text-gray-400"
                  >
                    DEVELOPMENT
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Developments from the DRID</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
