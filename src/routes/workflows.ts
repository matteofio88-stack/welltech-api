import { Router, Request, Response } from 'express';
import { trendController } from '../controllers/trendController';

const router = Router();

console.log('🔧 Initializing workflows router...');

// Trend analysis endpoints
router.get('/trends', trendController.getAllTrends);
router.get('/trends/category/:category', trendController.getTrendsByCategory);
router.get('/trends/google', trendController.fetchGoogleTrends);
router.post('/trends/analyze', trendController.analyzeTrends);
router.post('/trends', trendController.createTrend);

// ClickBank API endpoints
// Endpoint di test semplice per verificare che le route funzionino
console.log('🔧 Registering ClickBank routes...');
router.get('/clickbank', (req: Request, res: Response) => {
  console.log('✅ ClickBank base endpoint called');
  res.json({ 
    message: 'ClickBank API endpoints are available',
    status: 'ok',
    endpoints: {
      test: '/api/workflows/clickbank/test',
      endpoints: '/api/workflows/clickbank/endpoints',
      orders: '/api/workflows/clickbank/orders',
      stats: '/api/workflows/clickbank/stats'
    }
  });
});

// Carica il controller ClickBank dinamicamente per gestire errori
let clickbankController: any = null;
try {
  clickbankController = require('../controllers/clickbankController').clickbankController;
  
  router.get('/clickbank/test', clickbankController.testConnection);
  router.get('/clickbank/endpoints', clickbankController.testEndpoints);
  router.get('/clickbank/orders', clickbankController.getOrders);
  router.get('/clickbank/stats', clickbankController.getStats);
} catch (error) {
  console.error('Error loading ClickBank controller:', error);
  // Fallback: endpoint che indica che il controller non è disponibile
  router.get('/clickbank/test', (req: Request, res: Response) => {
    res.status(500).json({
      error: 'ClickBank controller not loaded',
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check server logs for details'
    });
  });
}

console.log('✅ Workflows router initialized');
export default router;
