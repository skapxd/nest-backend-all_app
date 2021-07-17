import { Headers, Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from "express";
@UseGuards(JwtAuthGuard)
@Controller()
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req : Request,
  ) {
    
    return this.storesService.uploadLogo(file, req);
  }


  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }


  @Get()
  findAll(
    @Query('city') city: string,
    @Query('country') country: string,
    @Query('categoryStore') categoryStore: string,
    @Query('department') department: string,
  ) {
    return this.storesService.findAll({
      city: city,
      country: country,
      categoryStore: categoryStore,
      department: department,
    });
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
