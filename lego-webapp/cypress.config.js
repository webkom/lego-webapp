import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'niikbo',
  defaultCommandTimeout: 10000,
  viewportWidth: 1000,
  viewportHeight: 1300,
  modifyObstructiveCode: false,
  chromeWebSecurity: false,
  video: true,
  videoCompression: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
