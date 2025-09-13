import React, { useState, useMemo } from 'react';
import HotelCard from './components/HotelCard';
import FilterSidebar from './components/FilterSidebar';
import SearchForm from './components/SearchForm';
import { hotelApiService } from './services/hotelApiService';

// Hotel interface
interface Hotel {
  id: string | number;
  name: string;
  price: number;
  rating: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  description: string;
  reviewCount?: number;
  stars?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface SearchData {
  destination: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  rooms: number;
}

function App() {
  // State management
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentSearch, setCurrentSearch] = useState<SearchData | null>(null);
  const [error, setError] = useState<string>('');

  // Filtered and sorted hotels
  const filteredHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = hotel.price <= maxPrice;
      const matchesRating = hotel.rating >= minRating;
      
      return matchesSearch && matchesPrice && matchesRating;
    });

    // Sort hotels
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered; // recommended order
    }
  }, [hotels, searchTerm, maxPrice, minRating, sortBy]);

  // Handle hotel search
  const handleSearch = async (searchData: SearchData) => {
    setIsLoading(true);
    setError('');
    setCurrentSearch(searchData);
    
    try {
      console.log('Searching for hotels:', searchData);
      const searchResults = await hotelApiService.searchHotels(searchData);
      
      setHotels(searchResults);
      setHasSearched(true);
      
      // Reset filters when new search is performed
      setSearchTerm('');
      setMaxPrice(1000);
      setMinRating(0);
      setSortBy('recommended');
      
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to search hotels. Please try again.');
      setHotels([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Event handlers
  const handleBookNow = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    console.log('Booking hotel:', hotel);
    alert(`Checking availability for ${hotel.name}!\n\nLocation: ${hotel.location}\nPrice: $${hotel.price}/night\nRating: ${hotel.rating} stars\n\nDates: ${currentSearch?.checkinDate} to ${currentSearch?.checkoutDate}\nGuests: ${currentSearch?.adults} adults${currentSearch?.children ? `, ${currentSearch?.children} children` : ''}\n\nRedirecting to booking page...`);
  };

  const formatDateRange = (checkin: string, checkout: string) => {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    return `${checkinDate.toLocaleDateString('en-US', options)} - ${checkoutDate.toLocaleDateString('en-US', options)}`;
  };

  const calculateNights = (checkin: string, checkout: string) => {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = checkoutDate.getTime() - checkinDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                TravelBooking
              </h1>
              <nav className="hidden md:flex space-x-6 text-sm">
                <a href="#" className="hover:text-blue-200">Stays</a>
                <a href="#" className="hover:text-blue-200">Flights</a>
                <a href="#" className="hover:text-blue-200">Car rentals</a>
                <a href="#" className="hover:text-blue-200">Attractions</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>USD</span>
              <span>US</span>
              <button className="bg-white text-blue-800 px-3 py-1 rounded">Register</button>
              <button className="bg-white text-blue-800 px-3 py-1 rounded">Sign in</button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Form */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* Search Summary Bar */}
      {currentSearch && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center font-medium text-blue-800">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {currentSearch.destination}
                </span>
                <span className="flex items-center text-blue-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDateRange(currentSearch.checkinDate, currentSearch.checkoutDate)} ({calculateNights(currentSearch.checkinDate, currentSearch.checkoutDate)} nights)
                </span>
                <span className="flex items-center text-blue-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {currentSearch.adults} adults{currentSearch.children > 0 && `, ${currentSearch.children} children`} · {currentSearch.rooms} room{currentSearch.rooms !== 1 ? 's' : ''}
                </span>
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Change search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <svg className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching for hotels...</h3>
            <p className="text-gray-600">Finding the best deals in {currentSearch?.destination}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {hasSearched && !isLoading && !error && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <FilterSidebar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                maxPrice={maxPrice}
                onMaxPriceChange={setMaxPrice}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                totalResults={filteredHotels.length}
              />
            </aside>

            {/* Main Results */}
            <main className="flex-1">
              {/* Results Header */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {currentSearch?.destination}: {filteredHotels.length} properties found
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {searchTerm ? `Filtered results for "${searchTerm}"` : 'Showing all available properties'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="recommended">Our top picks</option>
                      <option value="price-low">Price (lowest first)</option>
                      <option value="price-high">Price (highest first)</option>
                      <option value="rating">Guest rating</option>
                      <option value="name">Property name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selected Hotel Info */}
              {selectedHotel && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">Selected Hotel</h3>
                      <p className="text-green-700 mt-1">
                        <span className="font-semibold">{selectedHotel.name}</span> in {selectedHotel.location}
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        ${selectedHotel.price}/night · {selectedHotel.rating}⭐ · Ready to book!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hotel Results */}
              {filteredHotels.length > 0 ? (
                <div className="space-y-4">
                  {filteredHotels.map((hotel) => (
                    <HotelCard 
                      key={hotel.id} 
                      hotel={hotel} 
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search for a different destination.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setMaxPrice(1000);
                        setMinRating(0);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {filteredHotels.length > 0 && (
                <div className="text-center mt-8">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-medium">
                    Load more results
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Welcome State */}
      {!hasSearched && !isLoading && (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <svg className="w-20 h-20 text-blue-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Stay</h2>
            <p className="text-gray-600 text-lg mb-8">
              Search from thousands of hotels worldwide. Get instant results and book with confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-600 text-sm">Advanced filters and real-time results</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600 text-sm">Price matching and exclusive deals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Booking</h3>
                <p className="text-gray-600 text-sm">Safe and instant confirmation</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;