import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {


  async transform(value: any, { metatype }: ArgumentMetadata) {

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    const resError = errors.map((error) => {

      console.log(error)

      return {
        filed: `*${error.property}* field`,
        constraints: error.constraints
      }
    })

    if (errors.length > 0) {
      throw new BadRequestException({
        success: false,
        error: resError
      });
    }


    return value;
  }


  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}