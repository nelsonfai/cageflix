'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, X, Menu, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function Header({ 
  onSearchChange, 
  onSubmit, 
  isScrolled = false,
  genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi'] 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setGenreDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearchChange?.(e);
  };

  const clearSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalSearchTerm('');
    onSearchChange?.({ target: { value: '' } });

    setTimeout(() => {
      if (mobileSearchOpen && mobileInputRef.current) {
        mobileInputRef.current.focus();
      } else {
        desktopInputRef.current?.focus();
      }
    }, 10);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMobileSearchOpen(false);

    if (onSubmit) {
      onSubmit(e);
    } else if (localSearchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(localSearchTerm.trim())}`);
    }
  };

  const navigateToGenre = (genre) => {
    router.push(`/genre?genre=${encodeURIComponent(genre)}`);
    setGenreDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const GenreDropdown = ({ mobile = false }) => (
    <div className={mobile ? 'py-3' : 'relative'} ref={dropdownRef}>
      <button
        onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
        className={mobile 
          ? 'flex items-center justify-between w-full text-lg focus:outline-none' 
          : 'flex items-center space-x-1 hover:text-gray-300 transition-colors focus:outline-none'}
        aria-expanded={genreDropdownOpen}
        aria-controls="genre-dropdown"
      >
        <span>Genres</span>
        {genreDropdownOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
      </button>

      {genreDropdownOpen && (
        <div
          id="genre-dropdown"
          className={mobile
            ? 'mt-3 grid grid-cols-2 gap-3'
            : 'absolute top-full right-0 mt-2 bg-black border border-gray-700 rounded shadow-lg z-50 w-48 py-2'}
        >
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => navigateToGenre(genre)}
              className={mobile
                ? 'text-left py-2 px-3 text-gray-300 hover:bg-gray-800 rounded transition-colors'
                : 'block w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors'}
            >
              {genre}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${isScrolled || !isHomePage ? 'bg-black' : 'bg-gradient-to-b from-black via-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <Link href="/" className="text-red-600 text-2xl md:text-3xl font-bold cursor-pointer">
          CAGEFLIX
        </Link>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSubmit} className="hidden md:flex items-center">
            <div className="relative w-64">
              <input
                ref={desktopInputRef}
                type="text"
                name="search"
                value={localSearchTerm}
                onChange={handleSearchChange}
                placeholder="Titles, people, genres"
                className="bg-black/60 border border-white/20 text-white text-base rounded-l w-full h-10 px-8 focus:outline-none focus:border-white/40"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {localSearchTerm && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white h-10 px-4 rounded-r transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="hidden md:block">
            <GenreDropdown />
          </div>

          <div className="flex md:hidden space-x-3">
            <button 
              className="text-white focus:outline-none p-2" 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="text-white focus:outline-none p-2" 
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black z-50 animate-fadeIn">
          <div className="flex items-center p-4 border-b border-gray-800">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="text-white mr-3"
              aria-label="Back"
            >
              <ChevronUp className="h-5 w-5 transform rotate-90" />
            </button>

            <form onSubmit={handleSubmit} className="flex-1 flex items-center">
              <div className="relative flex-1">
                <input
                  ref={mobileInputRef}
                  type="text"
                  name="search"
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  placeholder="Titles, people, genres"
                  className="bg-black/60 border border-white/20 text-white text-base rounded w-full h-10 px-8"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {localSearchTerm && (
                  <button 
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button 
                type="submit" 
                className="ml-3 bg-red-600 hover:bg-red-700 text-white h-10 w-10 flex items-center justify-center rounded"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {localSearchTerm.trim() && (
            <div className="p-4">
              <p className="text-gray-400 mb-3">Top Suggestions</p>
              <div className="space-y-4">
                <button className="flex w-full items-center text-left py-2 border-b border-gray-800">
                  <Search className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{localSearchTerm}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mobileMenuOpen && (
        <nav className="md:hidden bg-black/95 py-4 px-6 flex flex-col space-y-4 border-t border-gray-800 animate-fadeIn">
          <GenreDropdown mobile />
        </nav>
      )}
    </header>
  );
}
