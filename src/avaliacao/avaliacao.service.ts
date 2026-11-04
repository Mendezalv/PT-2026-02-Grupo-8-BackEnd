import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  validateNota(nota: number): void {
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      throw new BadRequestException(
        'A nota da avaliacao deve ser um numero inteiro entre 1 e 5.',
      );
    }
  }

    async createAvaliacaoProduto(usuarioId: number, dto: CreateAvaliacaoProdutoDto) {
    this.validateNota(dto.nota);

    try {
      return await this.prisma.avaliacaoProduto.create({
        data: {
          usuarioId,
          produtoId: dto.produtoId,
          nota: dto.nota,
          comentario: dto.comentario,
        },
        include: {
          usuario: {
            select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
          },
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Voce ja avaliou este produto.');
      if (e.code === 'P2003') throw new NotFoundException('Produto nao encontrado.');
      throw e;
    }
  }

    async createAvaliacaoLoja(usuarioId: number, dto: CreateAvaliacaoLojaDto) {
    this.validateNota(dto.nota);

    try {
      return await this.prisma.avaliacaoLoja.create({
        data: {
          usuarioId,
          lojaId: dto.lojaId,
          nota: dto.nota,
          comentario: dto.comentario,
        },
        include: {
          usuario: {
            select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
          },
        },
      });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Voce ja avaliou esta loja.');
      if (e.code === 'P2003') throw new NotFoundException('Loja nao encontrada.');
      throw e;
    }
  }

  async findByProduto(produtoId: number) {
    return this.prisma.avaliacaoProduto.findMany({
      where: { produtoId },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
        comentarios: {
          include: {
            usuario: {
              select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLoja(lojaId: number) {
    return this.prisma.avaliacaoLoja.findMany({
      where: { lojaId },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
        comentarios: {
          include: {
            usuario: {
              select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

    // ---------- BUSCAR UMA ----------

  async findOneProduto(id: number) {
    const avaliacao = await this.prisma.avaliacaoProduto.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
        comentarios: {
          include: {
            usuario: {
              select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
            },
          },
        },
      },
    });
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    return avaliacao;
  }

  async findOneLoja(id: number) {
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
        comentarios: {
          include: {
            usuario: {
              select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
            },
          },
        },
      },
    });
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    return avaliacao;
  }

  // ---------- ATUALIZAR ----------

  async updateAvaliacaoProduto(
    id: number,
    usuarioId: number,
    dto: UpdateAvaliacaoProdutoDto,
  ) {
    const avaliacao = await this.prisma.avaliacaoProduto.findUnique({ where: { id } });
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException('Voce so pode editar as suas proprias avaliacoes.');
    }
    if (dto.nota !== undefined) this.validateNota(dto.nota);

    return this.prisma.avaliacaoProduto.update({
      where: { id },
      data: {
        nota: dto.nota ?? avaliacao.nota,
        comentario: dto.comentario ?? avaliacao.comentario,
      },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
      },
    });
  }

  async updateAvaliacaoLoja(
    id: number,
    usuarioId: number,
    dto: UpdateAvaliacaoLojaDto,
  ) {
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({ where: { id } });
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException('Voce so pode editar as suas proprias avaliacoes.');
    }
    if (dto.nota !== undefined) this.validateNota(dto.nota);

    return this.prisma.avaliacaoLoja.update({
      where: { id },
      data: {
        nota: dto.nota ?? avaliacao.nota,
        comentario: dto.comentario ?? avaliacao.comentario,
      },
      include: {
        usuario: {
          select: { id: true, nome: true, username: true, fotoPerfilUrl: true },
        },
      },
    });
  }

  // ---------- REMOVER ----------

  async removeAvaliacaoProduto(id: number, usuarioId: number) {
    const avaliacao = await this.prisma.avaliacaoProduto.findUnique({ where: { id } });
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException('Voce so pode remover as suas proprias avaliacoes.');
    }
    await this.prisma.avaliacaoProduto.delete({ where: { id } });
    return { message: 'Avaliacao removida com sucesso.' };
  }

  async removeAvaliacaoLoja(id: number, usuarioId: number) {
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({ where: { id } });
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException('Voce so pode remover as suas proprias avaliacoes.');
    }
    await this.prisma.avaliacaoLoja.delete({ where: { id } });
    return { message: 'Avaliacao removida com sucesso.' };
  }
}
