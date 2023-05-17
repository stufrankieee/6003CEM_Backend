import { AuthUserDto } from './dto/auth-user.dto';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

const saltRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async auth(authUserDto: AuthUserDto): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        username: authUserDto.username,
      },
    });

    if (user == null) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'The username is not exist.',
      }, HttpStatus.FORBIDDEN);
    }
    const verified = await bcrypt.compare(authUserDto.password, user.password);

    if (!verified) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'The login password is incorrect.',
      }, HttpStatus.FORBIDDEN);
    }

    return true;
  }

  async create(createUserDto: CreateUserDto) {
    console.log("User Password" + createUserDto);
    if (createUserDto.password === undefined) {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      const user: User = {
        id: null,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        username: createUserDto.username,
        password: hashedPassword,
      };

      return await this.usersRepository.save(user);
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    const user: User = {
      id: updateUserDto.id,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      username: updateUserDto.username,
      password: updateUserDto.password,
    };

    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(+id);
  }
}
