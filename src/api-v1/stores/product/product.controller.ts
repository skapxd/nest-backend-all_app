import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductStoreDto } from './dto/product_store.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { CustomValidationPipe } from 'src/pipes/custom_error.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload-image-product')
  @UseInterceptors(FileInterceptor('file'))
  uploadImagineProduct(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ){
    return this.productService.uploadImageProduct(file, req);
  }

  
  @Post()
  create(
    @Body(new CustomValidationPipe()) productDto: ProductStoreDto, 
    @Req() req: Request,
  ) {
    return this.productService.create(productDto, req);
  }

  // @Get()
  // findAll() {
  //   return this.productService.findByIds();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
