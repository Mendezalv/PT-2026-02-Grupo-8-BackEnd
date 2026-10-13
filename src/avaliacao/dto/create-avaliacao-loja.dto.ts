import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateAvaliacaoLojaDto {
  @IsInt({ message: 'O ID da loja deve ser um numero inteiro' })
  lojaId: number;

  @IsInt({ message: 'A nota deve ser um numero inteiro' })
  @Min(1, { message: 'A nota deve ser no minimo 1' })
  @Max(5, { message: 'A nota deve ser no maximo 5' })
  nota: number;

  @IsOptional()
  @IsString({ message: 'O comentario deve ser uma string' })
  @MaxLength(1000, { message: 'O comentario deve ter no maximo 1000 caracteres' })
  comentario?: string;
}
