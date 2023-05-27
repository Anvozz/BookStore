import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ServiceResponse } from 'src/classes/ServiceResponse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { tel, email, username } = createUserDto;
    /**
     * Check if database has email/tel/username as same then reject
     */
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('username = :username ', { username })
      .orWhere('email = :email', { email })
      .orWhere('tel = :tel', { tel })
      .execute();
    if (user.length >= 1)
      throw new HttpException(
        'Email/Tel/Username already exist',
        HttpStatus.BAD_REQUEST,
      );
    // Hashing password //
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    return this.usersRepository.save(createUserDto);
  }

  async findAll(): Promise<ServiceResponse<User[]>> {
    const resp = new ServiceResponse<User[]>();
    resp.data = await this.usersRepository.find({
      select: [
        'email',
        'firstname',
        'id',
        'isActive',
        'lastname',
        'tel',
        'updatedAt',
        'username',
        'createdAt',
      ],
    });
    return resp;
  }

  async findOne(id: number): Promise<ServiceResponse<User | null>> {
    const resp = new ServiceResponse<User>();
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    resp.data = user;
    return resp;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
