import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';
import { CreateComentarioAvaliacaoDto } from './dto/create-comentario-avaliacao.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { User } from '../user/entities/user.entity';

@Controller('comentario-avaliacao')
export class ComentarioAvaliacaoController {
  constructor(
    private readonly comentarioAvaliacaoService: ComentarioAvaliacaoService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateComentarioAvaliacaoDto,
  ) {
    return this.comentarioAvaliacaoService.create(user.id!, dto);
  }

  @IsPublic()
  @Get('loja/:avaliacaoLojaId')
  findByAvaliacaoLoja(
    @Param('avaliacaoLojaId', ParseIntPipe) avaliacaoLojaId: number,
  ) {
    return this.comentarioAvaliacaoService.findByAvaliacaoLoja(avaliacaoLojaId);
  }

  @IsPublic()
  @Get('produto/:avaliacaoProdutoId')
  findByAvaliacaoProduto(
    @Param('avaliacaoProdutoId', ParseIntPipe) avaliacaoProdutoId: number,
  ) {
    return this.comentarioAvaliacaoService.findByAvaliacaoProduto(
      avaliacaoProdutoId,
    );
  }
}
