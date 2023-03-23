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

module.exports = withSentryConfig(withImages({
  env: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || "http://esapi.sparkfivetest.com",
    SOCKET_BASE_URL: process.env.SERVER_BASE_URL ? `${process.env.SERVER_BASE_URL}` : "http://esapi.sparkfivetest.com",
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL || "http://esdev.sparkfivetest.com",
    // SERVER_BASE_URL: "https://d13c3bdc9413.ngrok.io",
    DROPBOX_API_KEY: process.env.DROPBOX_API_KEY || "gtwo80vc34l8vjd",
    //DROPBOX_API_KEY: process.env.DROPBOX_API_KEY || "6rimytfrzluesfn",
    STRIPE_PUBLIC_KEY:
      process.env.STRIPE_PUBLIC_KEY || "pk_test_bK1C20PBomU24spmlMeg4AXp",
    STRIPE_EXPIRE_PRODUCT_NAME:
      process.env.STRIPE_EXPIRE_PRODUCT_NAME || "Free",
    STRIPE_DEFAULT_SIGNUP_PRICE:
      process.env.STRIPE_DEFAULT_SIGNUP_PRICE ||
      "price_1HvYJMI2e9K8b8wp6Mo8AX7K",
    DEFAULT_TRIAL_PRODUCT:
      process.env.DEFAULT_TRIAL_PRODUCT || "prod_Hv5C1USjYMtYBp",
    GOOGLE_CLIENT_ID:
      process.env.GOOGLE_CLIENT_ID || "1053631313639-o0m00gdem0cgd3agg6i4o0iop657llkk.apps.googleusercontent.com",
      //"1003078561600-mf9f0cb0303di0ps9u8n3tgqvoddl7c6.apps.googleusercontent.com",
      //"1053631313639-o0m00gdem0cgd3agg6i4o0iop657llkk.apps.googleusercontent.com",
    GOOGLE_DEVELOPER_KEY:
      process.env.GOOGLE_DEVELOPER_KEY || "AIzaSyAqsbbj0ufdPdUO7tQwkvU1gAPn19hTo3s",
      //"AIzaSyAYOOdG3qKk5ZSwoI-8WtXepioT1SdduyA",
      //"AIzaSyAqsbbj0ufdPdUO7tQwkvU1gAPn19hTo3s",
    APPSYNC_GRAPHQL_REALTIMEURL:
      process.env.APPSYNC_GRAPHQL_REALTIMEURL ||
      "wss://it7l2l7v25dvhhet4izohabywu.appsync-realtime-api.us-east-1.amazonaws.com/graphql",
    INCLUDE_PIXEL: process.env.INCLUDE_PIXEL || "no",
    INCLUDE_GOOGLE_ANALYTICS: process.env.INCLUDE_GOOGLE_ANALYTICS || "no",
    SENTRY_ENV: process.env.SENTRY_ENV || "dev",
  },
}), sentryWebpackPluginOptions);


