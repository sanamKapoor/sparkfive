const withImages = require("next-images");
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  url: 'https://sentry.io/',
  org: 'sparkfive',
  project: 'sparkfive-client',
  authToken: '30797f831ca8489fb038d2a1aa850c246b888b5ffbe94d798ca91c1666898bdf',
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = {...withSentryConfig(
  withImages({
    env: {
      SERVER_BASE_URL: process.env.SERVER_BASE_URL,
      SOCKET_BASE_URL: process.env.SERVER_BASE_URL,
      CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
      // SERVER_BASE_URL: "https://d13c3bdc9413.ngrok.io",
      DROPBOX_API_KEY: process.env.DROPBOX_API_KEY,
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      STRIPE_EXPIRE_PRODUCT_NAME: process.env.STRIPE_EXPIRE_PRODUCT_NAME,
      STRIPE_DEFAULT_SIGNUP_PRICE: process.env.STRIPE_DEFAULT_SIGNUP_PRICE,
      DEFAULT_TRIAL_PRODUCT: process.env.DEFAULT_TRIAL_PRODUCT,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_DEVELOPER_KEY: process.env.GOOGLE_DEVELOPER_KEY,
      APPSYNC_GRAPHQL_REALTIMEURL: process.env.APPSYNC_GRAPHQL_REALTIMEURL,
      INCLUDE_PIXEL: process.env.INCLUDE_PIXEL,
      INCLUDE_GOOGLE_ANALYTICS: process.env.INCLUDE_GOOGLE_ANALYTICS,
      SENTRY_ENV: process.env.SENTRY_ENV,
    },
  }),
  sentryWebpackPluginOptions
), 
  //TODO: not right practice, so remove it once whole project is typed
  typescript: {
    ignoreBuildErrors: true,
  },

};
