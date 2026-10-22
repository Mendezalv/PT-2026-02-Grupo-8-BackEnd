import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { User } from '../user/entities/user.entity';

@Controller('avaliacao')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post('produto')
  createProduto(
    @CurrentUser() user: User,
    @Body() dto: CreateAvaliacaoProdutoDto,
  ) {
    return this.avaliacaoService.createAvaliacaoProduto(user.id!, dto);
  }

  @Post('loja')
  createLoja(
    @CurrentUser() user: User,
    @Body() dto: CreateAvaliacaoLojaDto,
  ) {
    return this.avaliacaoService.createAvaliacaoLoja(user.id!, dto);
  }

  @IsPublic()
  @Get('produto/:produtoId')
  findByProduto(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.avaliacaoService.findByProduto(produtoId);
  }

  @IsPublic()
  @Get('loja/:lojaId')
  findByLoja(@Param('lojaId', ParseIntPipe) lojaId: number) {
    return this.avaliacaoService.findByLoja(lojaId);
  }
}
