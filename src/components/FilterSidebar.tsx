import React, { useState } from 'react';

interface FilterSidebarProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  maxPrice: number;
  onMaxPriceChange: (maxPrice: number) => void;
  minRating: number;
  onMinRatingChange: (minRating: number) => void;
  totalResults: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  searchTerm,
  onSearchChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  totalResults
}) => {
  
  const [isVisible, setIsVisible] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMaxPriceChange(parseInt(e.target.value));
  };

  const clearFilters = () => {
    onSearchChange('');
    onMaxPriceChange(1000);
    onMinRatingChange(0);
  };

  const hasActiveFilters = searchTerm || maxPrice < 1000 || minRating > 0;

  const priceRanges = [
    { min: 0, max: 100, label: '$0 - $100' },
    { min: 100, max: 200, label: '$100 - $200' },
    { min: 200, max: 300, label: '$200 - $300' },
    { min: 300, max: 500, label: '$300 - $500' },
    { min: 500, max: 1000, label: '$500+' },
  ];

  const amenityFilters = [
    { id: 'wifi', label: 'Free WiFi', icon: '📶' },
    { id: 'parking', label: 'Free Parking', icon: '🅿️' },
    { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'spa', label: 'Spa', icon: '🧖‍♀️' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'gym', label: 'Fitness Center', icon: '💪' },
    { id: 'pets', label: 'Pet Friendly', icon: '🐕' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
  ];

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left hover:bg-gray-50"
        >
          <span className="font-medium">Filters {hasActiveFilters && `(${[searchTerm, maxPrice < 1000, minRating > 0].filter(Boolean).length})`}</span>
          <svg className={`w-5 h-5 transform transition-transform ${isVisible ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isVisible ? 'block' : 'hidden'} lg:block
        bg-white rounded-lg border border-gray-200 p-4 space-y-6 h-fit sticky top-4
      `}>
        
        {/* Search */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            Search
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Hotel name or location..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            Your Budget (per night)
          </h3>
          
          {/* Price Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>$0</span>
              <span className="font-medium">${maxPrice}+</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={maxPrice}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((maxPrice - 50) / (500 - 50)) * 100}%, #e5e7eb ${((maxPrice - 50) / (500 - 50)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>

          {/* Price Range Buttons */}
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="priceRange"
                  checked={maxPrice === range.max}
                  onChange={() => onMaxPriceChange(range.max)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            Star Rating
          </h3>
          <div className="space-y-2">
            {[0, 3, 4, 4.5].map((rating) => (
              <label key={rating} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => onMinRatingChange(rating)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  {rating === 0 ? (
                    <span className="text-sm text-gray-700">Any rating</span>
                  ) : (
                    <>
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-700">{rating}+ stars</span>
                    </>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            Facilities
          </h3>
          <div className="space-y-2">
            {amenityFilters.map((amenity) => (
              <label key={amenity.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm">{amenity.icon}</span>
                <span className="text-sm text-gray-700">{amenity.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            Property Type
          </h3>
          <div className="space-y-2">
            {[
              { id: 'hotel', label: 'Hotels', count: '156' },
              { id: 'apartment', label: 'Apartments', count: '89' },
              { id: 'resort', label: 'Resorts', count: '24' },
              { id: 'villa', label: 'Villas', count: '12' },
              { id: 'hostel', label: 'Hostels', count: '8' },
            ].map((type) => (
              <label key={type.id} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </div>
                <span className="text-xs text-gray-500">({type.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full py-3 px-4 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}

        {/* Results Summary */}
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-sm text-gray-600">
            {totalResults} properties found
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;