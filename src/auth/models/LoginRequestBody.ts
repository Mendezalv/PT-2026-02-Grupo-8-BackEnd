import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsEmail({}, { message: 'O e-mail informado e invalido' })
  email: string;

  @IsString({ message: 'A senha e obrigatoria' })
  password: string;
}
