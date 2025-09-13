import React, { useState, useMemo } from 'react';
import HotelCard from './components/HotelCard';
import SearchBar from './components/SearchBar';

// Hotel interface
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

function App() {
  // State management - like C# properties
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);

  // Extended hotel data for better testing
  const hotels: Hotel[] = [
    {
      id: 1,
      name: "Luxury Ocean Resort",
      price: 299,
      rating: 4.8,
      location: "Malibu, California",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      amenities: ["Ocean View", "Spa", "Pool", "Restaurant", "WiFi"],
      description: "Experience ultimate luxury with stunning ocean views and world-class amenities."
    },
    {
      id: 2,
      name: "Downtown Business Hotel",
      price: 159,
      rating: 4.2,
      location: "Manhattan, New York",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      amenities: ["Business Center", "Gym", "WiFi", "Restaurant"],
      description: "Perfect for business travelers with modern facilities and prime location."
    },
    {
      id: 3,
      name: "Boutique Mountain Lodge",
      price: 199,
      rating: 4.6,
      location: "Aspen, Colorado",
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
      amenities: ["Mountain View", "Fireplace", "Ski Access", "Hot Tub"],
      description: "Cozy mountain retreat with breathtaking views and easy access to skiing."
    },
    {
      id: 4,
      name: "Budget City Inn",
      price: 89,
      rating: 3.8,
      location: "Chicago, Illinois",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      amenities: ["WiFi", "Breakfast", "Parking"],
      description: "Affordable accommodation in the heart of Chicago with essential amenities."
    },
    {
      id: 5,
      name: "Tropical Paradise Resort",
      price: 450,
      rating: 4.9,
      location: "Bora Bora, French Polynesia",
      imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
      amenities: ["Overwater Bungalow", "Snorkeling", "Spa", "All-Inclusive"],
      description: "Ultimate tropical paradise with overwater bungalows and crystal-clear lagoons."
    },
    {
      id: 6,
      name: "Historic European Hotel",
      price: 175,
      rating: 4.4,
      location: "Prague, Czech Republic",
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
      amenities: ["Historic Building", "City Center", "Restaurant", "WiFi"],
      description: "Charming historic hotel in the heart of Prague with traditional architecture."
    }
  ];

  // Filtered hotels using useMemo (like C# computed properties)
  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesSearch = 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = hotel.price <= maxPrice;
      const matchesRating = hotel.rating >= minRating;
      
      return matchesSearch && matchesPrice && matchesRating;
    });
  }, [searchTerm, maxPrice, minRating]);

  // Event handlers
  const handleBookNow = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    console.log('Booking hotel:', hotel);
    alert(`Great choice! You selected ${hotel.name} for $${hotel.price}/night.`);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleMaxPriceChange = (newMaxPrice: number) => {
    setMaxPrice(newMaxPrice);
  };

  const handleMinRatingChange = (newMinRating: number) => {
    setMinRating(newMinRating);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            🏨 Travel Booking App
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Find and book your perfect stay
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          maxPrice={maxPrice}
          onMaxPriceChange={handleMaxPriceChange}
          minRating={minRating}
          onMinRatingChange={handleMinRatingChange}
        />

        {/* Selected Hotel Info */}
        {selectedHotel && (
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <h3 className="font-semibold text-blue-800">Last Selected Hotel:</h3>
            <p className="text-blue-700">{selectedHotel.name} - ${selectedHotel.price}/night</p>
          </div>
        )}

        {/* Hotels Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {filteredHotels.length > 0 
              ? `Hotels Found (${filteredHotels.length} of ${hotels.length})` 
              : 'No hotels match your criteria'
            }
          </h2>
          
          {filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <HotelCard 
                  key={hotel.id} 
                  hotel={hotel} 
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No hotels match your search criteria</p>
              <p className="text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Search Results Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredHotels.length}</div>
              <div className="text-gray-600">Hotels Found</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredHotels.length > 0 ? `$${Math.min(...filteredHotels.map(h => h.price))}` : 'N/A'}
              </div>
              <div className="text-gray-600">Lowest Price</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredHotels.length > 0 
                  ? `${(filteredHotels.reduce((sum, h) => sum + h.rating, 0) / filteredHotels.length).toFixed(1)}⭐`
                  : 'N/A'
                }
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{hotels.length}</div>
              <div className="text-gray-600">Total Hotels</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;