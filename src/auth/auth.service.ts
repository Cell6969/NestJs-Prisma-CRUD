import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { jwt_config } from 'src/config/config_jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  /**
   * Register User
   * @param data
   * @returns
   */

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      throw new HttpException('User sudah terdaftar', HttpStatus.FOUND);
    }

    data.password = await hash(data.password, 12);
    const createUser = await this.prisma.users.create({
      data: data,
    });
    if (createUser) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Register berhasil',
      };
    }
  }

  /**
   * Login User
   * @param data
   * @returns
   */
  async login(data: LoginDto) {
    const checkUserExists = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!checkUserExists) {
      throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await compare(
      data.password,
      checkUserExists.password,
    );
    if (checkPassword) {
      const accessToken = this.generateJWT({
        sub: checkUserExists.id,
        name: checkUserExists.name,
        email: checkUserExists.email,
      });

      return {
        statusCode: 200,
        message: 'Login Success',
        accessToken,
      };
    } else {
      throw new HttpException(
        `User atau password tidak sama`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Find user by id
   * @param user_id
   */
  async profile(user_id: number) {
    const data = await this.prisma.users.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
    if (data) {
      return {
        statusCode: HttpStatus.OK,
        data: data,
      };
    }
    throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
  }

  /**
   * Upload avatar to user profile
   * @param user_id
   * @param avatar
   * @returns
   */
  async UploadAvatar(user_id: number, avatar) {
    const checkUserExists = await this.prisma.users.findFirst({
      where: {
        id: user_id,
      },
    });
    if (checkUserExists) {
      const updateAvatar = await this.prisma.users.update({
        data: {
          avatar: avatar,
        },
        where: {
          id: user_id,
        },
      });
      if (updateAvatar) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Update avatar berhasil',
        };
      }
    }
    throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  }

  /**
   * Generate JWT Token
   * @param payload
   * @returns
   */
  generateJWT(payload: any) {
    return this.jwtService.sign(payload, {
      secret: jwt_config.secret,
      expiresIn: jwt_config.expired,
    });
  }
}
