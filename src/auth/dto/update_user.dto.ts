import { PartialType } from '@nestjs/mapped-types';
import { CreateUserEntity } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserEntity) {}
