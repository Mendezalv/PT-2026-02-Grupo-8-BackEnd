import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { User } from '../user/entities/user.entity';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

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

    // ---------- BUSCAR UMA ----------

  @IsPublic()
  @Get('produto/item/:id')
  findOneProduto(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacaoService.findOneProduto(id);
  }

  @IsPublic()
  @Get('loja/item/:id')
  findOneLoja(@Param('id', ParseIntPipe) id: number) {
    return this.avaliacaoService.findOneLoja(id);
  }

  // ---------- ATUALIZAR ----------

  @Patch('produto/:id')
  updateProduto(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateAvaliacaoProdutoDto,
  ) {
    return this.avaliacaoService.updateAvaliacaoProduto(id, user.id!, dto);
  }

  @Patch('loja/:id')
  updateLoja(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() dto: UpdateAvaliacaoLojaDto,
  ) {
    return this.avaliacaoService.updateAvaliacaoLoja(id, user.id!, dto);
  }

  // ---------- REMOVER ----------

  @Delete('produto/:id')
  removeProduto(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.avaliacaoService.removeAvaliacaoProduto(id, user.id!);
  }

  @Delete('loja/:id')
  removeLoja(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.avaliacaoService.removeAvaliacaoLoja(id, user.id!);
  }
}
