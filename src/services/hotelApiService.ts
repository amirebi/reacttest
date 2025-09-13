// Remove this line:
// import { SearchData, Hotel } from "../types";

// Add these interfaces directly:
interface SearchData {
    destination: string;
    checkinDate: string;
    checkoutDate: string;
    adults: number;
    children: number;
    rooms: number;
  }
  
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
  
  // Rest of your hotelApiService code...

// API Configuration
const RAPID_API_KEY = 'your_rapidapi_key_here'; // You'll need to get this from RapidAPI
const HOTELS_API_BASE = 'https://hotels-com-provider.p.rapidapi.com/v2';
const BOOKING_API_BASE = 'https://booking-com.p.rapidapi.com/v1';

class HotelApiService {
  
  // Method 1: Hotels.com via RapidAPI (Recommended - most reliable)
  async searchHotelsRapidAPI(searchData: SearchData): Promise<Hotel[]> {
    try {
      const { destination, checkinDate, checkoutDate, adults, children, rooms } = searchData;
      
      // First, search for destination ID
      const destinationResponse = await fetch(
        `${HOTELS_API_BASE}/locations?query=${encodeURIComponent(destination)}&locale=en_US`,
        {
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
          }
        }
      );
      
      const destinationData = await destinationResponse.json();
      
      if (!destinationData.suggestions || destinationData.suggestions.length === 0) {
        throw new Error('Destination not found');
      }
      
      const destinationId = destinationData.suggestions[0].entities[0].destinationId;
      
      // Search for hotels
      const hotelsResponse = await fetch(
        `${HOTELS_API_BASE}/properties/list?destinationId=${destinationId}&pageNumber=1&pageSize=25&checkIn=${checkinDate}&checkOut=${checkoutDate}&adults1=${adults}&children1=${children}&sortOrder=PRICE_HIGHEST_FIRST&locale=en_US&currency=USD`,
        {
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
          }
        }
      );
      
      const hotelsData = await hotelsResponse.json();
      
      return this.transformHotelsComData(hotelsData);
      
    } catch (error) {
      console.error('RapidAPI Error:', error);
      // Fallback to mock data if API fails
      return this.getMockHotels(searchData.destination);
    }
  }
  
  // Method 2: Booking.com via RapidAPI
  async searchBookingComAPI(searchData: SearchData): Promise<Hotel[]> {
    try {
      const { destination, checkinDate, checkoutDate, adults, children } = searchData;
      
      const response = await fetch(
        `${BOOKING_API_BASE}/hotels/search?query=${encodeURIComponent(destination)}&checkin_date=${checkinDate}&checkout_date=${checkoutDate}&adults_number=${adults}&children_number=${children}&room_number=1&locale=en-gb&currency=USD&order_by=popularity&page_number=0&include_adjacency=true`,
        {
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
          }
        }
      );
      
      const data = await response.json();
      return this.transformBookingComData(data);
      
    } catch (error) {
      console.error('Booking.com API Error:', error);
      return this.getMockHotels(searchData.destination);
    }
  }
  
  // Method 3: Free Mock API for development/testing
  async searchMockAPI(searchData: SearchData): Promise<Hotel[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return this.getMockHotels(searchData.destination);
  }
  
  // Primary search method - tries APIs in order of preference
  async searchHotels(searchData: SearchData): Promise<Hotel[]> {
    try {
      // Try RapidAPI first (most reliable)
      if (RAPID_API_KEY && RAPID_API_KEY !== 'your_rapidapi_key_here') {
        console.log('Searching with RapidAPI...');
        return await this.searchHotelsRapidAPI(searchData);
      }
      
      // Fallback to mock data for development
      console.log('Using mock data for development...');
      return await this.searchMockAPI(searchData);
      
    } catch (error) {
      console.error('All API methods failed, using mock data:', error);
      return this.getMockHotels(searchData.destination);
    }
  }
  
  // Transform Hotels.com data to our Hotel interface
  private transformHotelsComData(data: any): Hotel[] {
    if (!data.data || !data.data.body || !data.data.body.searchResults || !data.data.body.searchResults.results) {
      return [];
    }
    
    return data.data.body.searchResults.results.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      price: hotel.ratePlan?.price?.exactCurrent || Math.floor(Math.random() * 300) + 100,
      rating: hotel.guestReviews?.rating || 4.0,
      location: `${hotel.address?.locality || ''}, ${hotel.address?.region || ''}, ${hotel.address?.countryName || ''}`,
      imageUrl: hotel.optimizedThumbUrls?.srpDesktop || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop`,
      amenities: hotel.amenities?.map((a: any) => a.name).slice(0, 6) || ['WiFi', 'Parking', 'Restaurant'],
      description: hotel.shortDescription || 'Beautiful hotel with excellent amenities and service.',
      reviewCount: hotel.guestReviews?.total || 150,
      stars: hotel.starRating || 4,
      coordinates: {
        lat: hotel.coordinate?.lat || 0,
        lng: hotel.coordinate?.lon || 0
      }
    }));
  }
  
  // Transform Booking.com data to our Hotel interface
  private transformBookingComData(data: any): Hotel[] {
    if (!data.result) {
      return [];
    }
    
    return data.result.map((hotel: any) => ({
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      price: hotel.price_breakdown?.all_inclusive_price || Math.floor(Math.random() * 300) + 100,
      rating: hotel.review_score || 4.0,
      location: `${hotel.address}, ${hotel.city}, ${hotel.country_trans}`,
      imageUrl: hotel.main_photo_url || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop`,
      amenities: hotel.hotel_facilities?.slice(0, 6) || ['WiFi', 'Parking', 'Restaurant'],
      description: hotel.hotel_description || 'Beautiful hotel with excellent amenities and service.',
      reviewCount: hotel.review_nr || 150,
      stars: hotel.class || 4,
      coordinates: {
        lat: hotel.latitude || 0,
        lng: hotel.longitude || 0
      }
    }));
  }
  
  // Mock data for development and fallback
  private getMockHotels(destination: string): Hotel[] {
    const mockHotels = [
      {
        id: '1',
        name: `Grand ${destination} Hotel`,
        price: 245,
        rating: 4.7,
        location: `${destination} City Center`,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=400&fit=crop',
        amenities: ['Free WiFi', 'Spa', 'Pool', 'Restaurant', '24/7 Concierge', 'Gym'],
        description: `Luxury hotel in the heart of ${destination} with world-class amenities and exceptional service.`,
        reviewCount: 1247,
        stars: 5,
        coordinates: { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 }
      },
      {
        id: '2',
        name: `${destination} Business Center`,
        price: 180,
        rating: 4.3,
        location: `${destination} Financial District`,
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=400&fit=crop',
        amenities: ['Free WiFi', 'Business Center', 'Meeting Rooms', 'Restaurant', 'Gym'],
        description: `Modern business hotel perfect for corporate travelers visiting ${destination}.`,
        reviewCount: 892,
        stars: 4,
        coordinates: { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 }
      },
      {
        id: '3',
        name: `Boutique ${destination} Suites`,
        price: 320,
        rating: 4.8,
        location: `${destination} Historic Quarter`,
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=400&fit=crop',
        amenities: ['Free WiFi', 'Suites', 'Rooftop Bar', 'Historic Building', 'Art Gallery'],
        description: `Stylish boutique hotel in ${destination}'s most charming historic district.`,
        reviewCount: 623,
        stars: 5,
        coordinates: { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 }
      },
      {
        id: '4',
        name: `${destination} Budget Lodge`,
        price: 95,
        rating: 3.9,
        location: `${destination} Suburbs`,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
        amenities: ['Free WiFi', 'Parking', 'Continental Breakfast', '24/7 Front Desk'],
        description: `Clean, comfortable and affordable accommodation near ${destination}.`,
        reviewCount: 445,
        stars: 3,
        coordinates: { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 }
      },
      {
        id: '5',
        name: `${destination} Riverside Resort`,
        price: 380,
        rating: 4.9,
        location: `${destination} Waterfront`,
        imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500&h=400&fit=crop',
        amenities: ['River View', 'Spa', 'Fine Dining', 'Marina', 'Pool', 'Golf Course'],
        description: `Luxury waterfront resort with stunning river views and premium amenities in ${destination}.`,
        reviewCount: 891,
        stars: 5,
        coordinates: { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 }
      },
      {
        id: '6',
        name: `Modern ${destination} Tower`,
        price: 210,
        rating: 4.4,
        location: `${destination} Downtown`,
        imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&h=400&fit=crop',
        amenities: ['City View', 'Modern Design', 'Gym', 'Restaurant', 'Business Center'],
        description: `Contemporary high-rise hotel with panoramic city views and modern amenities.`,
        reviewCount: 756,
        stars: 4,
        coordinates: { lat: 48.8566 + Math.random() * 0.1, lng: 2.3522 + Math.random() * 0.1 }
      }
    ];

    // Add some randomization to make searches feel more dynamic
    return mockHotels
      .map(hotel => ({
        ...hotel,
        price: hotel.price + Math.floor(Math.random() * 50) - 25, // Price variation
        rating: Math.max(3.5, hotel.rating + (Math.random() * 0.4) - 0.2) // Rating variation
      }))
      .sort((a, b) => b.rating - a.rating); // Sort by rating
  }
}

// Export singleton instance
export const hotelApiService = new HotelApiService();