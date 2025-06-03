
import { Country, City, DistributionCategory, DistributionPoint, DistributionSettings } from '@/types/distribution';

// Mock data storage (in real app, this would be API calls)
let mockDistributionData: DistributionSettings = {
  countries: [
    {
      _id: '1',
      name: 'India',
      code: 'IN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  cities: [],
  categories: [
    {
      _id: 'cat1',
      name: 'Malls',
      icon: 'Building',
      color: 'text-blue-600',
      defaultToteCount: 400,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat2',
      name: 'Parks',
      icon: 'Trees',
      color: 'text-green-600',
      defaultToteCount: 600,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat3',
      name: 'Theatres',
      icon: 'MapPin',
      color: 'text-purple-600',
      defaultToteCount: 400,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat4',
      name: 'Metro Stations',
      icon: 'Train',
      color: 'text-orange-600',
      defaultToteCount: 800,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: 'cat5',
      name: 'Schools',
      icon: 'GraduationCap',
      color: 'text-red-600',
      defaultToteCount: 400,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  points: []
};

// Initialize with 100 Indian cities and their distribution points
const initializeData = () => {
  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
    'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
    'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
    'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
    'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad',
    'Tiruchirappalli', 'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon', 'Aligarh', 'Jalandhar',
    'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur',
    'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad',
    'Kochi', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded',
    'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
    'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode',
    'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Udaipur', 'Kakinada'
  ];

  // Create cities
  mockDistributionData.cities = indianCities.map((cityName, index) => ({
    _id: `city_${index + 1}`,
    countryId: '1',
    name: cityName,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // Create distribution points for each city and category
  const pointTemplates = {
    'cat1': [ // Malls
      'Phoenix MarketCity', 'Select CityWalk', 'DLF Mall', 'Inorbit Mall', 'Forum Mall',
      'Express Avenue', 'Palladium Mall', 'Ambience Mall', 'Nexus Mall', 'VR Mall'
    ],
    'cat2': [ // Parks
      'Central Park', 'City Garden', 'Municipal Park', 'Rose Garden', 'Children\'s Park',
      'Botanical Garden', 'Public Garden', 'Eco Park', 'Heritage Park', 'Community Park'
    ],
    'cat3': [ // Theatres
      'PVR Cinemas', 'INOX', 'Cinepolis', 'Carnival Cinemas', 'Big Cinemas',
      'Fun Republic', 'MovieTime', 'Miraj Cinemas', 'Mukta A2', 'Wave Cinemas'
    ],
    'cat4': [ // Metro Stations
      'Central Metro Station', 'City Centre Metro', 'Main Railway Metro', 'Airport Metro',
      'Business District Metro', 'University Metro', 'Hospital Metro', 'Stadium Metro',
      'Mall Connect Metro', 'IT Park Metro'
    ],
    'cat5': [ // Schools
      'Delhi Public School', 'Kendriya Vidyalaya', 'DAV School', 'Ryan International',
      'Bharatiya Vidya Bhavan', 'St. Xavier\'s School', 'Modern School', 'Sardar Patel Vidyalaya',
      'Cambridge School', 'Presidency School'
    ]
  };

  mockDistributionData.points = [];
  let pointId = 1;

  mockDistributionData.cities.forEach(city => {
    mockDistributionData.categories.forEach(category => {
      const templates = pointTemplates[category._id as keyof typeof pointTemplates] || [];
      templates.forEach(template => {
        mockDistributionData.points.push({
          _id: `point_${pointId++}`,
          cityId: city._id!,
          categoryId: category._id!,
          name: template,
          defaultToteCount: category.defaultToteCount,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });
  });
};

// Initialize data if not already done
if (mockDistributionData.cities.length === 0) {
  initializeData();
}

export const fetchDistributionSettings = async (): Promise<DistributionSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDistributionData;
};

export const createCountry = async (country: Omit<Country, '_id' | 'createdAt' | 'updatedAt'>): Promise<Country> => {
  const newCountry: Country = {
    ...country,
    _id: `country_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockDistributionData.countries.push(newCountry);
  return newCountry;
};

export const updateCountry = async (id: string, updates: Partial<Country>): Promise<Country> => {
  const index = mockDistributionData.countries.findIndex(c => c._id === id);
  if (index === -1) throw new Error('Country not found');
  
  mockDistributionData.countries[index] = {
    ...mockDistributionData.countries[index],
    ...updates,
    updatedAt: new Date()
  };
  return mockDistributionData.countries[index];
};

export const createCity = async (city: Omit<City, '_id' | 'createdAt' | 'updatedAt'>): Promise<City> => {
  const newCity: City = {
    ...city,
    _id: `city_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockDistributionData.cities.push(newCity);
  return newCity;
};

export const updateCity = async (id: string, updates: Partial<City>): Promise<City> => {
  const index = mockDistributionData.cities.findIndex(c => c._id === id);
  if (index === -1) throw new Error('City not found');
  
  mockDistributionData.cities[index] = {
    ...mockDistributionData.cities[index],
    ...updates,
    updatedAt: new Date()
  };
  return mockDistributionData.cities[index];
};

export const createCategory = async (category: Omit<DistributionCategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<DistributionCategory> => {
  const newCategory: DistributionCategory = {
    ...category,
    _id: `cat_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockDistributionData.categories.push(newCategory);
  return newCategory;
};

export const updateCategory = async (id: string, updates: Partial<DistributionCategory>): Promise<DistributionCategory> => {
  const index = mockDistributionData.categories.findIndex(c => c._id === id);
  if (index === -1) throw new Error('Category not found');
  
  mockDistributionData.categories[index] = {
    ...mockDistributionData.categories[index],
    ...updates,
    updatedAt: new Date()
  };
  return mockDistributionData.categories[index];
};

export const createDistributionPoint = async (point: Omit<DistributionPoint, '_id' | 'createdAt' | 'updatedAt'>): Promise<DistributionPoint> => {
  const newPoint: DistributionPoint = {
    ...point,
    _id: `point_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockDistributionData.points.push(newPoint);
  return newPoint;
};

export const updateDistributionPoint = async (id: string, updates: Partial<DistributionPoint>): Promise<DistributionPoint> => {
  const index = mockDistributionData.points.findIndex(p => p._id === id);
  if (index === -1) throw new Error('Distribution point not found');
  
  mockDistributionData.points[index] = {
    ...mockDistributionData.points[index],
    ...updates,
    updatedAt: new Date()
  };
  return mockDistributionData.points[index];
};

export const deleteDistributionPoint = async (id: string): Promise<void> => {
  const index = mockDistributionData.points.findIndex(p => p._id === id);
  if (index === -1) throw new Error('Distribution point not found');
  
  mockDistributionData.points.splice(index, 1);
};
