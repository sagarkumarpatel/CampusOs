import { v2 as cloudinary } from 'cloudinary';

/**
 * Returns the configured Cloudinary instance.
 * Called lazily so that dotenv has already populated process.env by the time
 * this is first invoked (dotenv.config() runs in server.ts before any request).
 */
export function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export default cloudinary;
