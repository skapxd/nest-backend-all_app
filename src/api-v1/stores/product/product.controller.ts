import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductStoreDto } from './dto/product_store.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { CustomValidationPipe } from 'src/pipes/custom_error.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteGroupProductsStoreDto } from './dto/delete_group_products_store.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(
    @Body(new CustomValidationPipe()) productDto: ProductStoreDto,
    @Req() req: Request,
  ) {
    return this.productService.create(productDto, req);
  }

  @Delete()
  deleteGroup(
    @Body(new CustomValidationPipe()) body: DeleteGroupProductsStoreDto,
    @Req() req: Request,
  ) {
    return this.productService. deleteGroupProducts(body.list, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

}
