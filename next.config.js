/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
	images: {
		domains: [process.env.MINIO_URL]
	}
}

module.exports = nextConfig
