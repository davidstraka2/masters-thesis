export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  hostname: process.env.HOSTNAME ?? 'localhost',
  apiGateway: {
    hostname: process.env.API_GATEWAY_HOSTNAME ?? 'localhost',
    port: parseInt(process.env.API_GATEWAY_PORT ?? '3080', 10),
  },
  mikroOrm: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: process.env.POSTGRES_PORT ?? 5432,
    user: process.env.POSTGRES_USER ?? 'booking_service',
    password: process.env.POSTGRES_PASSWORD ?? 'booking_service_password',
    dbName: process.env.POSTGRES_DB ?? 'booking_service_db',
  },
});
