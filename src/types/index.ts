// Types for API integration

export interface SearchData {
    destination: string;
    checkinDate: string;
    checkoutDate: string;
    adults: number;
    children: number;
    rooms: number;
  }
  
  export interface Hotel {
    id: string | number;
    name: string;
    price: number;
    rating: number;
    location: string;
    imageUrl: string;
    amenities: string[];
    description: string;
    currency?: string;
    pricePerNight?: number;
    reviewCount?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
    stars?: number;
    hotelClass?: string;
    checkIn?: string;
    checkOut?: string;
  }
  
  // RapidAPI Hotels Response Structure
  export interface RapidAPIHotelResponse {
    data: {
      hotels: Array<{
        id: string;
        name: string;
        price?: {
          amount: number;
          currency: string;
        };
        rating?: {
          overall: number;
          count: number;
        };
        location?: {
          address: string;
          city: string;
          country: string;
          coordinates?: {
            lat: number;
          lng: number;
          };
        };
        images?: Array<{
          url: string;
          caption?: string;
        }>;
        amenities?: string[];
        description?: string;
        stars?: number;
      }>;
    };
    status: string;
    message?: string;
  }
  
  // Alternative free API response structure (Hotels.com via RapidAPI)
  export interface HotelsComResponse {
    searchResults: {
      results: Array<{
        id: string;
        name: string;
        starRating: number;
        guestReviews?: {
          rating: number;
          total: number;
        };
        ratePlan?: {
          price: {
            current: string;
            exactCurrent: number;
          };
        };
        address: {
          streetAddress: string;
          locality: string;
          region: string;
          countryName: string;
        };
        optimizedThumbUrls?: {
          srpDesktop: string;
        };
        amenities?: Array<{
          name: string;
        }>;
        shortDescription?: string;
      }>;
    };
    summary: {
      totalProperties: number;
    };
  }
  
  // Booking.com API response structure
  export interface BookingComResponse {
    result: Array<{
      hotel_id: string;
      hotel_name: string;
      review_score?: number;
      review_nr?: number;
      price_breakdown?: {
        all_inclusive_price: number;
        currency: string;
      };
      address: string;
      city: string;
      country_trans: string;
      main_photo_url?: string;
      hotel_facilities?: string[];
      hotel_description?: string;
      class?: number;
      latitude?: number;
      longitude?: number;
    }>;
    count: number;
  }
  
  // Mock API response for development
  export interface MockAPIResponse {
    hotels: Array<{
      id: string;
      name: string;
      price: number;
      rating: number;
      location: string;
      image: string;
      amenities: string[];
      description: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    }>;
    total: number;
    page: number;
    limit: number;
  }