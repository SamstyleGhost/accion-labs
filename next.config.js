/** @type {import('next').NextConfig} */
const nextConfig = {
  // This config would be useful for client side rendering code
  // webpack: (config) => {
  //   // Ignore node-specific modules when bundling for the browser
  //   // https://webpack.js.org/configuration/resolve/#resolvealias
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     sharp$: false,
  //     "onnxruntime-node$": false,
  //   };
  //   return config;
  // },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },
};

module.exports = nextConfig
