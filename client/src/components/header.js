import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { Search, Menu, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = ({ isSearchPage = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Reset search expansion when navigating to search page
  useEffect(() => {
    if (isSearchPage) {
      setIsSearchExpanded(false);
    }
  }, [isSearchPage]);

  const handleSearchFocus = () => {
    if (!isSearchPage) {
      setIsSearchExpanded(true);
    }
  };

  const handleSearchBlur = (e) => {
    // Only collapse if clicking outside and not related to search
    if (!e.relatedTarget || !e.relatedTarget.closest(".search-container")) {
      setIsSearchExpanded(false);
    }
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3 || isSearchPage) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!isSearchPage) {
        setIsSearchExpanded(false);
      }
    }
  };

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
          <form
            onSubmit={handleSubmitSearch}
            className="w-full flex justify-end search-container"
          >
            <div
              className={`relative ${isSearchExpanded ? "w-full" : "w-52"} transition-all duration-300`}
            >
              <Input
                id="search-input"
                className={`rounded-4xl focus:w-full transition-all text-gray-900 ${isSearchExpanded ? "w-full" : "w-52"}`}
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-fuchsia-900"
              >
                <Search className="text-xs" />
              </button>
            </div>
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
          <form
            onSubmit={handleSubmitSearch}
            className="w-full flex justify-center mb-4"
          >
            <div className="relative w-full">
              <Input
                id="mobile-search-input"
                className="w-full text-gray-900 pr-10"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800"
              >
                <Search className="text-xs" />
              </button>
            </div>
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
