import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
};

startServer();
