import express from 'express';
import cors from 'cors';
import listingRoutes from './routes/listings.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/classifieds', listingRoutes);
app.use('/auth', authRoutes);

app.get('/api/classifieds', (req, res) => {
  res.json([
    { id: 1, title: 'MacBook Pro 2020', price: 950 },
    { id: 2, title: 'Honda Activa 2018', price: 400 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
