import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Usuario } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private toUser(user: Usuario): User {
    return {
      id: user.id,
      email: user.email,
      name: user.nome,
      username: user.username,
      fotoPerfilUrl: user.fotoPerfilUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (
      createUserDto.confirmPassword &&
      createUserDto.password !== createUserDto.confirmPassword
    ) {
      throw new BadRequestException(
        'A confirmacao de senha nao confere com a senha.',
      );
    }

    const existingEmail = await this.findByEmail(createUserDto.email);
    if (existingEmail) {
      throw new ConflictException('O e-mail informado ja esta em uso.');
    }

    const existingUsername = await this.findByUsername(createUserDto.username);
    if (existingUsername) {
      throw new ConflictException('O username informado ja esta em uso.');
    }

    const senhaHash = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.prisma.usuario.create({
      data: {
        email: createUserDto.email,
        nome: createUserDto.name,
        username: createUserDto.username,
        senhaHash,
        fotoPerfilUrl: createUserDto.fotoPerfilUrl,
      },
    });

    return this.toUser(createdUser);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      password: user.senhaHash,
      name: user.nome,
      username: user.username,
      fotoPerfilUrl: user.fotoPerfilUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.usuario.findUnique({ where: { username } });
    return user ? this.toUser(user) : null;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.usuario.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }
    return this.toUser(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findById(id);

    if (updateUserDto.username) {
      const existingUsername = await this.findByUsername(
        updateUserDto.username,
      );
      if (existingUsername && existingUsername.id !== id) {
        throw new ConflictException('O username informado ja esta em uso.');
      }
    }

    const data: {
      nome?: string;
      username?: string;
      fotoPerfilUrl?: string;
      senhaHash?: string;
    } = {};

    if (updateUserDto.name) data.nome = updateUserDto.name;
    if (updateUserDto.username) data.username = updateUserDto.username;
    if (updateUserDto.fotoPerfilUrl !== undefined) {
      data.fotoPerfilUrl = updateUserDto.fotoPerfilUrl;
    }
    if (updateUserDto.password) {
      data.senhaHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data,
    });

    return this.toUser(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findById(id);
    await this.prisma.usuario.delete({ where: { id } });
    return { message: 'Usuario removido com sucesso.' };
  }
}
