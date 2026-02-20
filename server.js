import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.js';
import appRoutes from './routes/apps.js';
import blogRoutes from './routes/blogs.js';
import topicRoutes from './routes/topics.js';
import categoryRoutes from './routes/category.js';

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/admin', adminRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/categories', categoryRoutes);

// Static uploads (if needed for local fallback)
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
