import { getConnection, initializeDatabase } from './src/dbconfig.js';

/** @type {import('next').NextConfig} */

console.log("INITIALIZED");
await initializeDatabase();

const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    }
};

export default nextConfig;
