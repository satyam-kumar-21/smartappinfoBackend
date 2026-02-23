import mongoose from 'mongoose';
import App from './models/App.js';
import dotenv from 'dotenv';

dotenv.config();

async function addDownloadsField() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const result = await App.updateMany(
    { downloads: { $exists: false } },
    { $set: { downloads: '' } }
  );
  // ...existing code...
  await mongoose.disconnect();
}

addDownloadsField().catch(console.error);
