import {
    Controller,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import sharp from 'sharp';

@Controller('uploads')
export class UploadsController {
  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.error('No file received by UploadsController');
      return { error: 'No file received' };
    }

    console.log(
      'Received file:',
      file.originalname,
      'saved as:',
      file.filename,
    );
    const filePath = file.path;
    const fileName = file.filename;
    const outputFileName = `optimized-${fileName.split('.')[0]}.webp`;
    const outputPath = join(process.cwd(), 'uploads', outputFileName);

    try {
      console.log('Optimizing image with sharp...');
      // Process image with sharp
      await sharp(filePath)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log('Optimization success. Deleting temp file:', filePath);
      // Remove original file
      fs.unlinkSync(filePath);

      return {
        url: `/uploads/${outputFileName}`,
      };
    } catch (error) {
      console.error('Error processing image with sharp:', error);
      // If error occurs, return the original file URL if it was saved
      return {
        url: `/uploads/${fileName}`,
      };
    }
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'uploads', image));
  }
}
