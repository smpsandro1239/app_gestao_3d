import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
    };
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'uploads', image));
  }
}
