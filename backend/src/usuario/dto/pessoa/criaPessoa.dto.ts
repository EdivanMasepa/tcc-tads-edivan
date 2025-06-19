import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";
import { SituacaoPessoa } from "../../../enums/situacaoPessoa.enum";
import { GeneroPessoa } from "../../../enums/generoPessoa.enum";

export class CriaPessoaDTO {

    @IsNumber({allowNaN: false}, {message: "Tipo do usuário não é compativel."})
    @IsNotEmpty({message: "Usuário não informado."})
    idUsuario: number;
  
    @IsString({message: "CPF tem tipo inválido."})
    @IsNotEmpty({ message: "CPF não pode ser vazio."})
    cpf: string;
  
    @IsString({message:"DATA DE NASCIMENTO tem tipo inválido."})
    @IsNotEmpty({ message: "DATA DE NASCIMENTO não pode ser vazia"})
    dataNascimento: string;

    @IsEnum(GeneroPessoa, {message:"GÊNERO não está predefinido."})
    @IsNotEmpty({ message: "GÊNERO não pode ser vazio."})
    genero: GeneroPessoa;

    @IsEnum(SituacaoPessoa, {message:"SITUAÇÃO não está predefinida."})
    @IsNotEmpty({ message: "SITUAÇÃO não pode ser vazia."})
    situacao: SituacaoPessoa;
}