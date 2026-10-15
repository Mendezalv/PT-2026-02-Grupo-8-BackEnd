import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Formato de e-mail invalido' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(6, { message: 'A senha deve possuir no minimo 6 caracteres' })
  @MaxLength(100, { message: 'A senha deve possuir no maximo 100 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'A confirmacao de senha deve ser uma string' })
  confirmPassword?: string;

  @IsString({ message: 'O nome e obrigatorio' })
  @MinLength(2, { message: 'O nome deve ter no minimo 2 caracteres' })
  @MaxLength(255, { message: 'O nome deve ter no maximo 255 caracteres' })
  name: string;

  @IsString({ message: 'O username e obrigatorio' })
  @MinLength(3, { message: 'O username deve ter no minimo 3 caracteres' })
  @MaxLength(50, { message: 'O username deve ter no maximo 50 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'O username deve conter apenas letras, numeros e sublinhado',
  })
  username: string;

  @IsOptional()
  @IsString()
  fotoPerfilUrl?: string;
}
