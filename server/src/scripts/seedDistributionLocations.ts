import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DistributionLocation, { LocationType } from '../models/DistributionLocation';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';
    console.log(`Using MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Seed data for malls
const malls = [
  { name: 'GVK One Mall', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Inorbit Mall Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Hyderabad Central', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Forum Sujana Mall', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Manjeera Mall', city: 'Hyderabad', state: 'Telangana' },
  { name: 'City Center Mall', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Sarath City Capital Mall', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Nexus Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { name: 'GSM Mall', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Hyderabad Next Galleria Mall', city: 'Hyderabad', state: 'Telangana' }
];

// Seed data for metro stations
const metroStations = [
  { name: 'Ameerpet', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Miyapur', city: 'Hyderabad', state: 'Telangana' },
  { name: 'LB Nagar', city: 'Hyderabad', state: 'Telangana' },
  { name: 'MGBS', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Secunderabad East', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Parade Ground', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Nagole', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Hitech City', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Begumpet', city: 'Hyderabad', state: 'Telangana' }
];

// Seed data for airports
const airports = [
  { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Begumpet Airport', city: 'Hyderabad', state: 'Telangana' }
];

// Seed data for schools
const schools = [
  { name: 'Hyderabad Public School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Delhi Public School Hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Oakridge International School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Chirec International School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Johnson Grammar School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Meridian School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Silver Oaks International School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Glendale Academy', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Sreenidhi International School', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Indus International School', city: 'Hyderabad', state: 'Telangana' }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding process...');
    
    // Check if collection exists and has documents
    const count = await DistributionLocation.countDocuments();
    console.log(`Found ${count} existing distribution locations`);
    
    // Clear existing data
    console.log('Clearing existing distribution locations...');
    await DistributionLocation.deleteMany({});
    console.log('✅ Cleared existing distribution locations');

    // Create mall locations
    console.log('Creating mall locations...');
    const mallLocations = malls.map(mall => ({
      name: mall.name,
      type: LocationType.MALL,
      city: mall.city,
      state: mall.state,
      totesCount: 0,
      isActive: true,
      openingHours: '10:00 AM - 10:00 PM'
    }));
    console.log(`Prepared ${mallLocations.length} mall locations`);

    // Create metro station locations
    console.log('Creating metro station locations...');
    const metroLocations = metroStations.map(station => ({
      name: station.name,
      type: LocationType.METRO_STATION,
      city: station.city,
      state: station.state,
      totesCount: 0,
      isActive: true,
      openingHours: '6:00 AM - 11:00 PM'
    }));
    console.log(`Prepared ${metroLocations.length} metro station locations`);

    // Create airport locations
    console.log('Creating airport locations...');
    const airportLocations = airports.map(airport => ({
      name: airport.name,
      type: LocationType.AIRPORT,
      city: airport.city,
      state: airport.state,
      totesCount: 0,
      isActive: true,
      openingHours: '24 hours'
    }));
    console.log(`Prepared ${airportLocations.length} airport locations`);

    // Create school locations
    console.log('Creating school locations...');
    const schoolLocations = schools.map(school => ({
      name: school.name,
      type: LocationType.SCHOOL,
      city: school.city,
      state: school.state,
      totesCount: 0,
      isActive: true,
      openingHours: '8:00 AM - 4:00 PM'
    }));
    console.log(`Prepared ${schoolLocations.length} school locations`);

    // Combine all locations
    const allLocations = [
      ...mallLocations,
      ...metroLocations,
      ...airportLocations,
      ...schoolLocations
    ];
    console.log(`Total locations to insert: ${allLocations.length}`);

    // Insert all locations
    console.log('Inserting locations into database...');
    const result = await DistributionLocation.insertMany(allLocations);
    console.log(`✅ Successfully seeded ${result.length} distribution locations`);

    // Log counts by type
    console.log('\nSummary of inserted locations:');
    console.log(`✅ Added ${mallLocations.length} mall locations`);
    console.log(`✅ Added ${metroLocations.length} metro station locations`);
    console.log(`✅ Added ${airportLocations.length} airport locations`);
    console.log(`✅ Added ${schoolLocations.length} school locations`);

  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  } finally {
    // Disconnect from database
    console.log('\nDisconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Run the seed function
connectDB().then(() => {
  seedDatabase();
});
