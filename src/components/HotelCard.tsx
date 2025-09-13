import React from 'react';

// TypeScript interfaces
interface Hotel {
  id: number;
  name: string;
  price: number;
  rating: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  description: string;
}

interface HotelCardProps {
  hotel: Hotel;
  onBookNow: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBookNow }) => {
  const handleBookClick = () => {
    onBookNow(hotel);
  };

  // Helper function to render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${hotel.id}`}>
              <stop offset="50%" stopColor="#FBBF24"/>
              <stop offset="50%" stopColor="#D1D5DB"/>
            </linearGradient>
          </defs>
          <path fill={`url(#half-${hotel.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    return stars;
  };

  const getReviewText = (rating: number) => {
    if (rating >= 4.5) return 'Exceptional';
    if (rating >= 4.0) return 'Excellent';
    if (rating >= 3.5) return 'Very Good';
    if (rating >= 3.0) return 'Good';
    return 'Fair';
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative sm:w-64 sm:flex-shrink-0">
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name}
            className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Favorite Button */}
          <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors">
            <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
            📷 12 photos
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {hotel.location}
                </div>
              </div>

              {/* Rating */}
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm mr-2">
                    {hotel.rating}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{getReviewText(hotel.rating)}</div>
                    <div className="text-gray-500 text-xs">834 reviews</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {hotel.description}
            </p>

            {/* Amenities */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {hotel.amenities.slice(0, 4).map((amenity, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                  >
                    ✓ {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{hotel.amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center text-sm text-green-700">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free cancellation until 6:00 PM on Dec 30
              </div>
              <div className="flex items-center text-sm text-green-700">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No prepayment needed – pay at the property
              </div>
            </div>
          </div>

          {/* Bottom Section - Price and Booking */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-3 border-t border-gray-200">
            <div className="text-right sm:text-left">
              <div className="text-xs text-gray-500 mb-1">1 night, 2 adults</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">${hotel.price}</span>
                <span className="text-gray-600 ml-1">/night</span>
              </div>
              <div className="text-xs text-gray-500">+$24 taxes and charges</div>
              <div className="text-xs text-green-600 font-medium mt-1">
                💰 We Price Match
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:min-w-[160px]">
              <button 
                onClick={handleBookClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded transition-colors text-center"
              >
                See availability
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition-colors text-sm flex items-center justify-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;