import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  icon: { type: String, required: true }, // Cloudinary URL
  images: [{ type: String }], // Screenshots URLs
  rating: { type: Number, min: 0, max: 5, default: 0 },
  votes: { type: String, default: '0' }, // e.g. '582K+ Votes'
  downloads: { type: String, default: '' }, // e.g. '1M', '500K', '1200'
  description1: { type: String }, // HTML string (table builder)
  description2: { type: String }, // HTML string (rich text)
  description3: { type: String }, // HTML string (rich text)
  playStoreUrl: { type: String },
  appStoreUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('App', appSchema);
