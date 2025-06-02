import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/causeconnect';
    console.log(`Using MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // List all collections
    console.log('\nListing collections:');
    const collections = await conn.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    console.log('\nDisconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }
};

// Run the test
testConnection();
