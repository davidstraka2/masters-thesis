export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: process.env.APP_NAME ?? "Booking Client App",
  apiDomain: process.env.API_DOMAIN ?? "http://localhost:3080",
  websiteDomain: process.env.WEBSITE_DOMAIN ?? "http://localhost:8080",
  apiBasePath: process.env.API_BASE_PATH ?? "/auth",
  websiteBasePath: process.env.WEBSITE_BASE_PATH ?? "/auth",
};
