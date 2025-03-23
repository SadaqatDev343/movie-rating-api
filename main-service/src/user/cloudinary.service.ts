import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { MulterFile } from 'src/types/multer.types';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: MulterFile): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'user_profiles',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      const bufferStream = require('stream').Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  }

  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const folderName = urlParts[urlParts.length - 2];
      const public_id = `${folderName}/${filename}`;

      const result = await cloudinary.uploader.destroy(public_id);

      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return false;
    }
  }
}
