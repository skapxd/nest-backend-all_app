import { Headers, Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, Req, Header, ParseIntPipe } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/store.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from "express";
import { CustomValidationPipe } from '../../pipes/custom_error.pipe';
import { FindAllStoreDto } from './dto/find_all_store.dto';
import { SetLocationsDto } from './dto/set_locations.dto';
import { FirebaseService } from '../../providers/firebase/firebase.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
  ) { }


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

  @Post('/set-location')
  setLocations(
    @Body(new CustomValidationPipe()) setLocationsDto: SetLocationsDto,
    @Req() req: Request,
  ) {
    return this.storesService.setLocation(setLocationsDto, req);
  }

  @Header('Cache-Control', '60')
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
