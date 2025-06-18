import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeneroPessoa } from '../../../enums/generoPessoa.enum';
import { SituacaoPessoa } from '../../../enums/situacaoPessoa.enum';

export class AtualizaPessoaDTO{

    @IsOptional()
    @IsNumber({allowNaN:false}, {message: "Erro no usuário."})
    idUsuario?: number;

    @IsOptional()
    @IsDate({message:"DATA DE NASCIMENTO deve ser uma data válida."})
    dataNascimento?: string;

    @IsOptional()
    @IsEnum(GeneroPessoa, {message:"GÊNERO não está predefinido."})
    genero?: GeneroPessoa;

    @IsOptional()
    @IsEnum(SituacaoPessoa, {message:"SITUAÇÃO não está predefinida."})
    situacao?: SituacaoPessoa;
}
