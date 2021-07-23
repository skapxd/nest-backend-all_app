import { Headers, Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create_store.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from "express";
import { CustomValidationPipe } from '../../pipes/custom_error.pipe';
import { FindAllStoreDto } from './dto/find_all_store.dto';
@UseGuards(JwtAuthGuard)
@Controller()
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {

    return this.storesService.uploadLogo(file, req);
  }


  @Post()
  create(
    @Body(new CustomValidationPipe()) createStoreDto: CreateStoreDto,
    @Req() req: Request,
  ) {
    return this.storesService.createStore(createStoreDto, req);
  }


  @Get()
  findAll(
    @Query(new CustomValidationPipe()) findAllStoreDto: FindAllStoreDto,
  ) {
    return this.storesService.findAll(findAllStoreDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }




  @Delete()
  remove(@Req() req: Request) {
    return this.storesService.removeLocationsStoreEntityFromStoreEntity(req);
  }
}
