import React from 'react';

// Props interface - like method parameters in C#
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  maxPrice: number;
  onMaxPriceChange: (maxPrice: number) => void;
  minRating: number;
  onMinRatingChange: (minRating: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange
}) => {
  
  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMaxPriceChange(parseInt(e.target.value));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMinRatingChange(parseFloat(e.target.value));
  };

  const clearFilters = () => {
    onSearchChange('');
    onMaxPriceChange(1000);
    onMinRatingChange(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🔍 Search & Filter Hotels
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search by name/location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Hotels
          </label>
          <input
            type="text"
            placeholder="Hotel name or location..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Max price filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price: ${maxPrice}
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="25"
            value={maxPrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$50</span>
            <span>$500</span>
          </div>
        </div>

        {/* Min rating filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={minRating}
            onChange={handleRatingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={0}>Any Rating</option>
            <option value={3.0}>3.0+ Stars</option>
            <option value={4.0}>4.0+ Stars</option>
            <option value={4.5}>4.5+ Stars</option>
          </select>
        </div>

        {/* Clear filters button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;