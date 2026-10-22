import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ComentarioAvaliacaoController } from './comentario-avaliacao.controller';
import { ComentarioAvaliacaoService } from './comentario-avaliacao.service';

@Module({
  imports: [PrismaModule],
  controllers: [ComentarioAvaliacaoController],
  providers: [ComentarioAvaliacaoService],
  exports: [ComentarioAvaliacaoService],
})
export class ComentarioAvaliacaoModule {}
