import { IsDate, IsNotEmpty, IsNumber, IsString, Min, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";

export class CriaPessoaDTO extends CriaUsuarioDTO {

    @IsNumber({allowNaN: false}, {message: "Tipo do usuário não é compativel."})
    @IsNotEmpty({message: "Usuário não informado."})
    idUsuario: number;
  
    @IsString({message: "CPF tem tipo inválido."})
    @IsNotEmpty({ message: "CPF não pode ser vazio."})
    cpf: string;
  
    @IsString({message:"DATA DE NASCIMENTO tem tipo inválido."})
    @IsNotEmpty({ message: "DATA DE NASCIMENTO não pode ser vazia"})
    dataNascimento: string;

    @IsString({message:"GÊNERO deve ser do tipo texto."})
    @IsNotEmpty({ message: "GÊNERO não pode ser vazio."})
    genero: string;

    @IsString({message:"SITUAÇÃO deve ser do tipo texto."})
    @IsNotEmpty({ message: "SITUAÇÃO não pode ser vazia."})
    situacao: string;
}