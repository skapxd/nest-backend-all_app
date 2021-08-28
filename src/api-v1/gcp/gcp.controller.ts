import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { GcpService } from './gcp.service';
import { Request } from "express";
import { UploadService } from '../../providers/upload/upload.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class GcpController {
  constructor(
    private readonly gcpService: GcpService,
    private readonly upload: UploadService,

  ) { }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {

    // return this.gcpService.uploadFile(file, req);
    return this.upload.saveInServer(file)
  }

}
