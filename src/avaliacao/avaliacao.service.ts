import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

const USUARIO_PUBLICO_SELECT = {
  id: true,
  nome: true,
  username: true,
  fotoPerfilUrl: true,
} as const;

const AVALIACAO_INCLUDE_AUTOR = {
  usuario: {
    select: USUARIO_PUBLICO_SELECT,
  },
} as const;

const AVALIACAO_INCLUDE_DETALHADA = {
  usuario: {
    select: USUARIO_PUBLICO_SELECT,
  },
  comentarios: {
    include: {
      usuario: {
        select: USUARIO_PUBLICO_SELECT,
      },
    },
  },
} as const;

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

  private async ensureDono<T extends { id: number; usuarioId: number }>(
    finder: () => Promise<T | null>,
    usuarioId: number,
    acao: 'editar' | 'remover',
  ): Promise<T> {
    const avaliacao = await finder();
    if (!avaliacao) {
      throw new NotFoundException('Avaliacao nao encontrada.');
    }
    if (avaliacao.usuarioId !== usuarioId) {
      throw new ForbiddenException(
        `Voce so pode ${acao} as suas proprias avaliacoes.`,
      );
    }
    return avaliacao;
  }

  // ---------- CRIAR ----------

  async createAvaliacaoProduto(
    usuarioId: number,
    dto: CreateAvaliacaoProdutoDto,
  ) {
    this.validateNota(dto.nota);

    try {
      return await this.prisma.avaliacaoProduto.create({
        data: {
          usuarioId,
          produtoId: dto.produtoId,
          nota: dto.nota,
          comentario: dto.comentario,
        },
        include: AVALIACAO_INCLUDE_AUTOR,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('Voce ja avaliou este produto.');
        }
        if (e.code === 'P2003') {
          throw new NotFoundException('Produto nao encontrado.');
        }
      }
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
        include: AVALIACAO_INCLUDE_AUTOR,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('Voce ja avaliou esta loja.');
        }
        if (e.code === 'P2003') {
          throw new NotFoundException('Loja nao encontrada.');
        }
      }
      throw e;
    }
  }

  // ---------- LISTAR ----------

  async findByProduto(produtoId: number) {
    return this.prisma.avaliacaoProduto.findMany({
      where: { produtoId },
      include: AVALIACAO_INCLUDE_DETALHADA,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByLoja(lojaId: number) {
    return this.prisma.avaliacaoLoja.findMany({
      where: { lojaId },
      include: AVALIACAO_INCLUDE_DETALHADA,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ---------- BUSCAR UMA ----------

  async findOneProduto(id: number) {
    const avaliacao = await this.prisma.avaliacaoProduto.findUnique({
      where: { id },
      include: AVALIACAO_INCLUDE_DETALHADA,
    });
    if (!avaliacao) {
      throw new NotFoundException('Avaliacao nao encontrada.');
    }
    return avaliacao;
  }

  async findOneLoja(id: number) {
    const avaliacao = await this.prisma.avaliacaoLoja.findUnique({
      where: { id },
      include: AVALIACAO_INCLUDE_DETALHADA,
    });
    if (!avaliacao) {
      throw new NotFoundException('Avaliacao nao encontrada.');
    }
    return avaliacao;
  }

  // ---------- ATUALIZAR ----------

  async updateAvaliacaoProduto(
    id: number,
    usuarioId: number,
    dto: UpdateAvaliacaoProdutoDto,
  ) {
    await this.ensureDono(
      () => this.prisma.avaliacaoProduto.findUnique({ where: { id } }),
      usuarioId,
      'editar',
    );
    if (dto.nota !== undefined) this.validateNota(dto.nota);

    const data: Prisma.AvaliacaoProdutoUpdateInput = {};
    if (dto.nota !== undefined) data.nota = dto.nota;
    if (dto.comentario !== undefined) data.comentario = dto.comentario;

    return this.prisma.avaliacaoProduto.update({
      where: { id },
      data,
      include: AVALIACAO_INCLUDE_AUTOR,
    });
  }

  async updateAvaliacaoLoja(
    id: number,
    usuarioId: number,
    dto: UpdateAvaliacaoLojaDto,
  ) {
    await this.ensureDono(
      () => this.prisma.avaliacaoLoja.findUnique({ where: { id } }),
      usuarioId,
      'editar',
    );
    if (dto.nota !== undefined) this.validateNota(dto.nota);

    const data: Prisma.AvaliacaoLojaUpdateInput = {};
    if (dto.nota !== undefined) data.nota = dto.nota;
    if (dto.comentario !== undefined) data.comentario = dto.comentario;

    return this.prisma.avaliacaoLoja.update({
      where: { id },
      data,
      include: AVALIACAO_INCLUDE_AUTOR,
    });
  }

  // ---------- REMOVER ----------

  async removeAvaliacaoProduto(id: number, usuarioId: number) {
    await this.ensureDono(
      () => this.prisma.avaliacaoProduto.findUnique({ where: { id } }),
      usuarioId,
      'remover',
    );
    await this.prisma.avaliacaoProduto.delete({ where: { id } });
    return { message: 'Avaliacao removida com sucesso.' };
  }

  async removeAvaliacaoLoja(id: number, usuarioId: number) {
    await this.ensureDono(
      () => this.prisma.avaliacaoLoja.findUnique({ where: { id } }),
      usuarioId,
      'remover',
    );
    await this.prisma.avaliacaoLoja.delete({ where: { id } });
    return { message: 'Avaliacao removida com sucesso.' };
  }
}
