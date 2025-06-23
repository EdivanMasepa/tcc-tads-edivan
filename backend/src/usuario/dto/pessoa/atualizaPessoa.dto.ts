import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeneroPessoaEnum } from '../../enum/generoPessoa.enum';
import { SituacaoPessoaEnum } from '../../enum/situacaoPessoa.enum';

export class AtualizaPessoaDTO{

    @IsOptional()
    @IsNumber({allowNaN:false}, {message: "Erro no usuário."})
    idUsuario?: number;

    @IsOptional()
    @IsDate({message:"DATA DE NASCIMENTO deve ser uma data válida."})
    dataNascimento?: string;

    @IsOptional()
    @IsEnum(GeneroPessoaEnum, {message:"GÊNERO não está predefinido."})
    genero?: GeneroPessoaEnum;

    @IsOptional()
    @IsEnum(SituacaoPessoaEnum, {message:"SITUAÇÃO não está predefinida."})
    situacao?: SituacaoPessoaEnum;
}
