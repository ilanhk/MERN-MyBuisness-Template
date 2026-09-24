export default () => ({
  port: Number(process.env.PORT ?? 5000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  infrastructureEnabled: process.env.ENABLE_INFRASTRUCTURE !== 'false',
});
