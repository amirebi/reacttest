import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (searchData: SearchData) => void;
  isLoading?: boolean;
}

interface SearchData {
  destination: string;
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  rooms: number;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    destination: '',
    checkinDate: '',
    checkoutDate: '',
    adults: 2,
    children: 0,
    rooms: 1
  });

  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  // Get today's date and tomorrow's date for default values
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    if (!searchData.checkinDate) {
      setSearchData(prev => ({
        ...prev,
        checkinDate: formatDate(tomorrow),
        checkoutDate: formatDate(nextWeek)
      }));
    }
  }, []);

  const handleInputChange = (field: keyof SearchData, value: string | number) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchData.destination.trim()) {
      onSearch(searchData);
    }
  };

  const incrementValue = (field: keyof Pick<SearchData, 'adults' | 'children' | 'rooms'>) => {
    setSearchData(prev => ({
      ...prev,
      [field]: Math.min(prev[field] + 1, field === 'rooms' ? 8 : 16)
    }));
  };

  const decrementValue = (field: keyof Pick<SearchData, 'adults' | 'children' | 'rooms'>) => {
    const minValue = field === 'adults' ? 1 : 0;
    const currentValue = field === 'rooms' ? 1 : 0;
    setSearchData(prev => ({
      ...prev,
      [field]: Math.max(prev[field] - 1, field === 'adults' || field === 'rooms' ? 1 : 0)
    }));
  };

  const getGuestSummary = () => {
    const parts = [];
    parts.push(`${searchData.adults} adult${searchData.adults !== 1 ? 's' : ''}`);
    if (searchData.children > 0) {
      parts.push(`${searchData.children} child${searchData.children !== 1 ? 'ren' : ''}`);
    }
    parts.push(`${searchData.rooms} room${searchData.rooms !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-yellow-400 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* Destination Input */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Where are you going?
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter destination (e.g., Paris, New York, London)"
                  value={searchData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={searchData.checkinDate}
                  onChange={(e) => handleInputChange('checkinDate', e.target.value)}
                  min={formatDate(today)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {searchData.checkinDate && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatDisplayDate(searchData.checkinDate)}
                </div>
              )}
            </div>

            {/* Check-out Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  value={searchData.checkoutDate}
                  onChange={(e) => handleInputChange('checkoutDate', e.target.value)}
                  min={searchData.checkinDate || formatDate(tomorrow)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {searchData.checkoutDate && (
                <div className="text-xs text-gray-500 mt-1">
                  {formatDisplayDate(searchData.checkoutDate)}
                </div>
              )}
            </div>

            {/* Guests and Rooms */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guests & Rooms
              </label>
              <button
                type="button"
                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                className="w-full text-left pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="text-gray-900">{getGuestSummary()}</span>
                <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Guests Dropdown */}
              {isGuestDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Adults</div>
                        <div className="text-sm text-gray-500">Ages 18+</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementValue('adults')}
                          disabled={searchData.adults <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{searchData.adults}</span>
                        <button
                          type="button"
                          onClick={() => incrementValue('adults')}
                          disabled={searchData.adults >= 16}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Children</div>
                        <div className="text-sm text-gray-500">Ages 0-17</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementValue('children')}
                          disabled={searchData.children <= 0}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{searchData.children}</span>
                        <button
                          type="button"
                          onClick={() => incrementValue('children')}
                          disabled={searchData.children >= 16}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Rooms</div>
                        <div className="text-sm text-gray-500">Hotel rooms</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => decrementValue('rooms')}
                          disabled={searchData.rooms <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{searchData.rooms}</span>
                        <button
                          type="button"
                          onClick={() => incrementValue('rooms')}
                          disabled={searchData.rooms >= 8}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsGuestDropdownOpen(false)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex justify-center lg:justify-end">
            <button
              type="submit"
              disabled={isLoading || !searchData.destination.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search Hotels</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;