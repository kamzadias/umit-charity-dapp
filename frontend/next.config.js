/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    productionBrowserSourceMaps: false,
    output: 'export',

    images: {
        unoptimized: true
    },

    env: {
        NEXT_PUBLIC_CLIENT_ID: process.env.CLIENT_ID
    },

    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    }
};

module.exports = nextConfig;
