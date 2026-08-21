import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Quick Bite API',
      region: 'Thiruvananthapuram District, Kerala, India',
      timestamp: new Date().toISOString()
    });
  });

  // Location Registry API
  app.get('/api/locations', (req, res) => {
    res.json({
      district: 'Thiruvananthapuram',
      state: 'Kerala',
      zones: [
        { id: 'tvm-technopark', name: 'Technopark & Kazhakkoottam', avgDeliveryMin: 15 },
        { id: 'tvm-kowdiar', name: 'Kowdiar & Sasthamangalam', avgDeliveryMin: 20 },
        { id: 'tvm-palayam', name: 'Palayam & Statue (City Core)', avgDeliveryMin: 18 },
        { id: 'tvm-sreekaryam', name: 'Sreekaryam & Kariavattom', avgDeliveryMin: 16 },
        { id: 'tvm-varkala', name: 'Varkala Cliff & Town', avgDeliveryMin: 28 },
        { id: 'tvm-kovalam', name: 'Kovalam & Vizhinjam Belt', avgDeliveryMin: 25 }
      ]
    });
  });

  // Orders API handler
  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    const orderId = `QB-TVM-${Date.now()}`;
    res.status(201).json({
      success: true,
      orderId,
      status: 'placed',
      estimatedDeliveryMinutes: 18,
      message: 'Order received and dispatched to kitchen.'
    });
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quick Bite backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
