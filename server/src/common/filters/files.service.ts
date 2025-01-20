import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  private getUploadPath(type: 'tracks' | 'images'): string {
    const uploadDir = this.configService.get('upload.uploadDir');
    return path.join(process.cwd(), uploadDir, type);
  }

  async uploadFile(
    file: Express.Multer.File,
    type: 'tracks' | 'images',
  ): Promise<string> {
    const uploadPath = this.getUploadPath(type);

    // Создаем директорию, если она не существует
    await fs.mkdir(uploadPath, { recursive: true });

    // Генерируем уникальное имя файла
    const fileExtension = path.extname(file.originalname);
    const fileName = crypto.randomBytes(16).toString('hex') + fileExtension;
    const filePath = path.join(uploadPath, fileName);

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Возвращаем путь к файлу относительно uploadDir
    return `${type}/${fileName}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(
      process.cwd(),
      this.configService.get('upload.uploadDir'),
      filePath,
    );

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      // Игнорируем ошибку, если файл не существует
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async getFileStream(filePath: string) {
    const fullPath = path.join(
      process.cwd(),
      this.configService.get('upload.uploadDir'),
      filePath,
    );
    return fs.readFile(fullPath);
  }
}