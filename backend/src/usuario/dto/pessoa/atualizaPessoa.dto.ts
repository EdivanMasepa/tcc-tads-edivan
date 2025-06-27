import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MinDate } from 'class-validator';
import { GeneroPessoaEnum } from '../../enum/generoPessoa.enum';
import { SituacaoPessoaEnum } from '../../enum/situacaoPessoa.enum';
import { Type } from 'class-transformer';

export class AtualizaPessoaDTO{

    @IsOptional()
    @Type(() => Date)
    @IsDate({message:"DATA DE NASCIMENTO tem tipo inválido."})    
    @MinDate(new Date('1925-01-01'), { message: 'DATA DE NASCIMENTO muito antiga, verifique.' })
    @MaxDate(new Date('2020-01-01'), { message: 'DATA DE NASCIMENTO muito recente, verifique.' })
    dataNascimento?: Date;

    @IsOptional()
    @IsEnum(GeneroPessoaEnum, {message:"GÊNERO não está predefinido."})
    genero?: GeneroPessoaEnum;

    @IsOptional()
    @IsEnum(SituacaoPessoaEnum, {message:"SITUAÇÃO não está predefinida."})
    situacao?: SituacaoPessoaEnum;
}
