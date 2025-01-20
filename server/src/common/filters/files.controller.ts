import {
    Controller,
    Post,
    Get,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Param,
    Res,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { FilesService } from './files.service';
  
  @Controller('files')
  export class FilesController {
    constructor(private readonly filesService: FilesService) {}
  
    @Post('upload/track')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadTrack(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
            new FileTypeValidator({ fileType: '.(mp3|wav)' }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      const filePath = await this.filesService.uploadFile(file, 'tracks');
      return { url: filePath };
    }
  
    @Post('upload/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
            new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      const filePath = await this.filesService.uploadFile(file, 'images');
      return { url: filePath };
    }
  
    @Get(':type/:filename')
    async getFile(
      @Param('type') type: string,
      @Param('filename') filename: string,
      @Res() res: Response,
    ) {
      const file = await this.filesService.getFileStream(`${type}/${filename}`);
      res.send(file);
    }
  }