import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';

@Injectable()
export class ComentarioAvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  validateExclusivity(avaliacaoLojaId?: number, avaliacaoProdutoId?: number): void {
    const hasLoja = avaliacaoLojaId !== undefined && avaliacaoLojaId !== null;
    const hasProduto = avaliacaoProdutoId !== undefined && avaliacaoProdutoId !== null;

    if ((hasLoja && hasProduto) || (!hasLoja && !hasProduto)) {
      throw new BadRequestException(
        'O comentario deve ser associado exclusivamente a uma avaliacao de loja ou a uma avaliacao de produto.',
      );
    }
  }

  async create(usuarioId: number, dto: CreateComentarioAvaliacaoDto) {
    this.validateExclusivity(dto.avaliacaoLojaId, dto.avaliacaoProdutoId);

    return this.prisma.comentarioAvaliacao.create({
      data: {
        usuarioId,
        avaliacaoLojaId: dto.avaliacaoLojaId,
        avaliacaoProdutoId: dto.avaliacaoProdutoId,
        conteudo: dto.conteudo,
      },
    });
  }
}
