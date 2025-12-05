import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/sequelize.js';
import listingsRouter from './routes/listings.js';

import authRoutes from './routes/auth.js';
import userCrudRoutes from './routes/user.js';
import listingCrudRoutes from './routes/listing.js';
import locationCrudRoutes from './routes/location.js';
import categoryCrudRoutes from './routes/category.js';
import adminRoutes from './routes/admins.js';
import reviewRoutes from './routes/reviews.js';
import favoriteRoutes from './routes/favorites.js';
import messageRoutes from './routes/messages.js';
import searchHistoryRoutes from './routes/searchHistory.js';
import notificationRoutes from './routes/notifications.js';
import './models/associations.js';
import cloudinaryRoutes from './routes/cloudinary.js';
import subcategoryCrudRoutes from './routes/subcategory.js';

dotenv.config();

const app = express();

// Middleware
// CORS configuration - allow frontend domain
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://frontend-blush-seven-55.vercel.app',
    'https://sh-seven-55.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/crud/users', userCrudRoutes);
app.use('/crud/listings', listingCrudRoutes);
app.use('/crud/locations', locationCrudRoutes);
app.use('/crud/categories', categoryCrudRoutes);
app.use('/crud/subcategories', subcategoryCrudRoutes);
app.use('/api/admins', adminRoutes);
app.use('/reviews', reviewRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/messages', messageRoutes);
app.use('/search-history', searchHistoryRoutes);
app.use('/notifications', notificationRoutes);
app.use('/listings', listingsRouter);
app.use('/api/cloudinary', cloudinaryRoutes);


// Sync Sequelize models and start the server
const PORT = process.env.PORT || 5000;
console.log('🔄 Starting server with Age/Gender fix...');
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Connected to PostgreSQL & models synced - Age/Gender fix active');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT} - Age/Gender fix active`);
    });
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await sequelize.close();
  process.exit(0);
});

export default app;
