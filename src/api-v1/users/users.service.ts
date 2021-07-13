import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { UpdateUserDto } from '../../auth/dto/update-user.dto';
import { Users as UserEntity } from '../../auth/entities/user.entity';
export type User = any;

@Injectable()
export class UsersService {

  findAll() {
    return `This action returns all users`;
  }


  async findOne(data: FindOneOptions): Promise<User | undefined> {
    // return await this.repository.findOne();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
