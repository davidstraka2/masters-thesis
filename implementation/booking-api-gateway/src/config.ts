export default () => ({
  port: parseInt(process.env.PORT ?? '3080', 10),
  hostname: process.env.HOSTNAME ?? 'localhost',
  bookingServiceIP: process.env.BOOKING_SERVICE_IP ?? '127.0.0.1',
  bookingServiceURL: process.env.BOOKING_SERVICE_URL ?? 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:8080',
  appInfo: {
    appName: process.env.APP_NAME ?? 'Booking Client App',
    apiDomain: process.env.API_DOMAIN ?? 'http://localhost:3080',
    websiteDomain: process.env.WEBSITE_DOMAIN ?? 'http://localhost:8080',
    apiBasePath: process.env.API_BASE_PATH ?? '/auth',
    websiteBasePath: process.env.WEBSITE_BASE_PATH ?? '/auth',
  },
  supertokens: {
    connectionURI:
      process.env.SUPERTOKENS_CONNECTION_URI ?? 'https://try.supertokens.com',
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID ?? '467101b197249757c71f',
    clientSecret:
      process.env.GITHUB_CLIENT_SECRET ??
      'e97051221f4b6426e8fe8d51486396703012f5bd',
  },
});
