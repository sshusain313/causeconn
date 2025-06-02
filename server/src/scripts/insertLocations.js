// Simple script to insert distribution locations using MongoDB native driver
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Location data
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

const airports = [
  { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana' },
  { name: 'Begumpet Airport', city: 'Hyderabad', state: 'Telangana' }
];

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

async function insertLocations() {
  console.log('Starting location insertion script...');
  
  // Get MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';
  console.log(`Using MongoDB URI: ${uri.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db();
    const collection = database.collection('distributionlocations');
    
    // Check if collection has documents
    const count = await collection.countDocuments();
    console.log(`Found ${count} existing distribution locations`);
    
    // Clear existing data
    if (count > 0) {
      console.log('Clearing existing distribution locations...');
      await collection.deleteMany({});
      console.log('Cleared existing distribution locations');
    }
    
    // Create mall locations
    console.log('Creating mall locations...');
    const mallLocations = malls.map(mall => ({
      name: mall.name,
      type: 'mall',
      city: mall.city,
      state: mall.state,
      totesCount: 0,
      isActive: true,
      openingHours: '10:00 AM - 10:00 PM',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Create metro station locations
    console.log('Creating metro station locations...');
    const metroLocations = metroStations.map(station => ({
      name: station.name,
      type: 'metro_station',
      city: station.city,
      state: station.state,
      totesCount: 0,
      isActive: true,
      openingHours: '6:00 AM - 11:00 PM',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Create airport locations
    console.log('Creating airport locations...');
    const airportLocations = airports.map(airport => ({
      name: airport.name,
      type: 'airport',
      city: airport.city,
      state: airport.state,
      totesCount: 0,
      isActive: true,
      openingHours: '24 hours',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Create school locations
    console.log('Creating school locations...');
    const schoolLocations = schools.map(school => ({
      name: school.name,
      type: 'school',
      city: school.city,
      state: school.state,
      totesCount: 0,
      isActive: true,
      openingHours: '8:00 AM - 4:00 PM',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Combine all locations
    const allLocations = [
      ...mallLocations,
      ...metroLocations,
      ...airportLocations,
      ...schoolLocations
    ];
    
    console.log(`Inserting ${allLocations.length} locations...`);
    
    // Insert all locations
    const result = await collection.insertMany(allLocations);
    console.log(`Successfully inserted ${result.insertedCount} distribution locations`);
    
    // Log counts by type
    console.log('\nSummary of inserted locations:');
    console.log(`Added ${mallLocations.length} mall locations`);
    console.log(`Added ${metroLocations.length} metro station locations`);
    console.log(`Added ${airportLocations.length} airport locations`);
    console.log(`Added ${schoolLocations.length} school locations`);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    // Close the connection
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
insertLocations().catch(console.error);
