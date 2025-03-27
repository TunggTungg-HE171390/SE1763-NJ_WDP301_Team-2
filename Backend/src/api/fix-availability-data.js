import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Availability from './models/availability.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Function to migrate availability data
const migrateAvailabilityData = async () => {
  try {
    console.log('Starting migration...');
    
    // Find all availabilities
    const availabilities = await Availability.find({});
    console.log(`Found ${availabilities.length} availability slots to process`);
    
    let updated = 0;
    
    // Process each availability
    for (const slot of availabilities) {
      // Skip slots that don't have status
      if (!slot.status) continue;
      
      // Set isBooked based on status
      const isBooked = slot.status === 'Booked';
      
      // Update the slot
      await Availability.updateOne(
        { _id: slot._id },
        { $set: { isBooked } }
      );
      
      updated++;
      
      // Log progress for large datasets
      if (updated % 1000 === 0) {
        console.log(`Processed ${updated} slots`);
      }
    }
    
    console.log(`Migration complete. Updated ${updated} availability slots.`);
    
    // Remove status field from all documents
    const result = await Availability.updateMany(
      {},
      { $unset: { status: "" } }
    );
    
    console.log(`Removed status field from ${result.modifiedCount} documents`);
    
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the migration
connectDB().then(() => {
  migrateAvailabilityData();
});
