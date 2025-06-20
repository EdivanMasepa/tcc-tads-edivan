import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MaxDate, Min, MinDate, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";
import { SituacaoPessoa } from "../../enum/situacaoPessoa.enum";
import { GeneroPessoa } from "../../enum/generoPessoa.enum";

export class CriaPessoaDTO {

    @IsNumber({allowNaN: false}, {message: "Tipo do usuário não é compativel."})
    @IsNotEmpty({message: "Usuário não informado."})
    idUsuario: number;
  
    @IsString({message: "CPF tem tipo inválido."})
    @IsNotEmpty({ message: "CPF não pode ser vazio."})
    cpf: string;
  
    @IsDate({message:"DATA DE NASCIMENTO tem tipo inválido."})
    @IsNotEmpty({message: "DATA DE NASCIMENTO não pode ser vazia"})
    @MinDate(new Date('1925-01-01'), { message: 'DATA muito antiga, verifique.' })
    @MaxDate(new Date('2020-01-01'), { message: 'DATA muito recente, verifique.' })
    dataNascimento: Date;

    @IsEnum(GeneroPessoa, {message:"GÊNERO não está predefinido."})
    @IsNotEmpty({ message: "GÊNERO não pode ser vazio."})
    genero: GeneroPessoa;

    @IsEnum(SituacaoPessoa, {message:"SITUAÇÃO não está predefinida."})
    @IsNotEmpty({ message: "SITUAÇÃO não pode ser vazia."})
    situacao: SituacaoPessoa;
}