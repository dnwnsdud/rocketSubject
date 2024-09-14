import i18nextConfig from './next-i18next.config.js';
/** @type {import('next').NextConfig} */
const {i18n} = i18nextConfig;
const nextConfig = {
  reactStrictMode: true,
  i18n,

};

export default nextConfig;
