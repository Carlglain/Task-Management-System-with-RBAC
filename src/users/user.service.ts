import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/createuser.dto';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from 'src/dto/updateuser.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async generateTokens(userId: number, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
  async hashToken(token: string) {
    return bcrypt.hash(token, 10);
  }

  async createUser(user: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { ...user },
    });
    if (existingUser) {
      throw new NotFoundException('User with credentials exist');
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  async validateUser(authPayLoad: { email: string; password: string }) {
    const { email, password } = authPayLoad;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );
    user.refreshToken = await this.hashToken(refreshToken);
    await this.userRepository.save(user);
    return { access_token: accessToken };
  }

  fetchUsers() {
    return this.userRepository.find();
  }
  async upDateUser(id: number, user: UpdateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    Object.assign(existingUser, user);

    return this.userRepository.save(existingUser);
  }
  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User delete successfully' };
  }
}
