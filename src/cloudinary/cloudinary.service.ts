import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import toStream from 'buffer-to-stream';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'products',
  ): Promise<UploadApiResponse> {
    const uniquePublicId = `${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: uniquePublicId,
          format: 'jpg',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'auto' },
            { fetch_format: 'auto', quality: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new Error(JSON.stringify(error)));
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
