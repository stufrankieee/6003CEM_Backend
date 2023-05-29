import { AuthUserDto } from './dto/auth-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';

const saltRounds = 10;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  async auth(authUserDto: AuthUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        username: authUserDto.username,
      },
    });

    if (user == null) {
      throw new HttpException('The username is not exist.', HttpStatus.FORBIDDEN);
    }
    const verified = await bcrypt.compare(authUserDto.password, user.password);

    if (!verified) {
      throw new HttpException('The login password is incorrect.', HttpStatus.FORBIDDEN);
    }

    const payload = {
      username: user.username,
      userId: user.id,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      data: payload,
    };
  }

  async create(createUserDto: CreateUserDto) {
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
