require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const spacesRoutes    = require('./src/routes/spaces.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
const swaggerSpec     = require('./src/swagger');

const app = express();

app.use(cors());
app.use(express.json());

// API docs (interactive)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// Routes
app.use('/spaces',    spacesRoutes);
app.use('/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'catalog-service' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[catalog-service] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[catalog-service] Running on port ${PORT}`);
});
