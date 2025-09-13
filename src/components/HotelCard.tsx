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

// Component with proper export
const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBookNow }) => {
  const handleBookClick = () => {
    onBookNow(hotel);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
      <img 
        src={hotel.imageUrl} 
        alt={hotel.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      
      <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
      <p className="text-gray-600 mb-2">{hotel.location}</p>
      <p className="text-gray-700 mb-4">{hotel.description}</p>
      
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-green-600">${hotel.price}</span>
          <span className="text-gray-600">/night</span>
        </div>
        
        <button 
          onClick={handleBookClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default HotelCard;