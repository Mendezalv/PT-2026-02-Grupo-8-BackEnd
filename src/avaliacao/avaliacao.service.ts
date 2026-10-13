import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';

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

    return this.prisma.avaliacaoProduto.create({
      data: {
        usuarioId,
        produtoId: dto.produtoId,
        nota: dto.nota,
        comentario: dto.comentario,
      },
    });
  }

  async createAvaliacaoLoja(usuarioId: number, dto: CreateAvaliacaoLojaDto) {
    this.validateNota(dto.nota);

    return this.prisma.avaliacaoLoja.create({
      data: {
        usuarioId,
        lojaId: dto.lojaId,
        nota: dto.nota,
        comentario: dto.comentario,
      },
    });
  }
}
