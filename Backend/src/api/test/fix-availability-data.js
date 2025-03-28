import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Import the Availability model
import Availability from '../models/availability.model.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function fixAvailabilityData() {
  try {
    // Find all availability records and fix them
    const records = await Availability.find({});
    console.log(`Found ${records.length} availability records to check`);
    
    let updated = 0;
    
    for (const record of records) {
      // Fix psychologistId format if needed (ensure it's a string)
      if (record.psychologistId && typeof record.psychologistId !== 'string') {
        record.psychologistId = record.psychologistId.toString();
        
        // Ensure date, startTime, and endTime are valid Date objects
        if (record.date && !(record.date instanceof Date)) {
          record.date = new Date(record.date);
        }
        if (record.startTime && !(record.startTime instanceof Date)) {
          record.startTime = new Date(record.startTime);
        }
        if (record.endTime && !(record.endTime instanceof Date)) {
          record.endTime = new Date(record.endTime);
        }
        
        await record.save();
        updated++;
      }
    }
    
    console.log(`Updated ${updated} records`);
  } catch (error) {
    console.error('Error fixing availability data:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
fixAvailabilityData();
