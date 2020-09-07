const withImages = require('next-images')
module.exports = withImages({
  env: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || 'http://localhost:8080',
    DROPBOX_API_KEY: process.env.DROPBOX_API_KEY || 'gtwo80vc34l8vjd',
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || 'pk_test_bK1C20PBomU24spmlMeg4AXp'
  },
})