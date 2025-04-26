import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ThumbValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) throw new BadRequestException('File is required');

    if (file.size > 50 * 1024) throw new BadRequestException('File too large');

    if (
      !['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(
        file.mimetype,
      )
    )
      throw new BadRequestException('Invalid file type');

    return file;
  }
}
