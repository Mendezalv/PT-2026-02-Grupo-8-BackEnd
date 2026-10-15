import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  @MinLength(2, { message: 'O nome deve ter no minimo 2 caracteres' })
  @MaxLength(255, { message: 'O nome deve ter no maximo 255 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O username deve ser uma string' })
  @MinLength(3, { message: 'O username deve ter no minimo 3 caracteres' })
  @MaxLength(50, { message: 'O username deve ter no maximo 50 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'O username deve conter apenas letras, numeros e sublinhado',
  })
  username?: string;

  @IsOptional()
  @IsString()
  fotoPerfilUrl?: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve possuir no minimo 6 caracteres' })
  @MaxLength(100, { message: 'A senha deve possuir no maximo 100 caracteres' })
  password?: string;
}
