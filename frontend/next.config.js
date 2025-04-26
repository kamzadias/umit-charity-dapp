/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    productionBrowserSourceMaps: false,

    images: {
        unoptimized: true
    },

    env: {
        NEXT_PUBLIC_CLIENT_ID: process.env.CLIENT_ID
    },

    webpack(config, { isServer }) {
        config.externals = config.externals || [];
        config.externals?.push('pino-pretty', 'lokijs', 'encoding');

        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                ws: false,
                bufferutil: false,
                'utf-8-validate': false
            };
        }

        return config;
    }
};

module.exports = nextConfig;
