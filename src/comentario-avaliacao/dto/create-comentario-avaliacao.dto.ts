import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsExclusiveAvaliacaoTarget', async: false })
export class IsExclusiveAvaliacaoTargetConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: unknown, args: ValidationArguments) {
    const obj = args.object as CreateComentarioAvaliacaoDto;
    const hasLoja = obj.avaliacaoLojaId !== undefined && obj.avaliacaoLojaId !== null;
    const hasProduto = obj.avaliacaoProdutoId !== undefined && obj.avaliacaoProdutoId !== null;

    return (hasLoja && !hasProduto) || (!hasLoja && hasProduto);
  }

  defaultMessage() {
    return 'O comentario deve ser associado exclusivamente a uma avaliacao de loja ou a uma avaliacao de produto.';
  }
}

export class CreateComentarioAvaliacaoDto {
  @IsOptional()
  @IsInt({ message: 'O ID da avaliacao de loja deve ser um numero inteiro' })
  avaliacaoLojaId?: number;

  @IsOptional()
  @IsInt({ message: 'O ID da avaliacao de produto deve ser um numero inteiro' })
  avaliacaoProdutoId?: number;

  @IsString({ message: 'O conteudo deve ser uma string' })
  @IsNotEmpty({ message: 'O conteudo nao pode ser vazio' })
  @MaxLength(2000, { message: 'O conteudo deve ter no maximo 2000 caracteres' })
  @Validate(IsExclusiveAvaliacaoTargetConstraint)
  conteudo: string;
}
