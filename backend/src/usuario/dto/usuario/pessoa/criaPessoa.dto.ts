import { IsDate, IsNotEmpty, IsNumber, IsString, Min, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";

export class CriaPessoaDto extends CriaUsuarioDTO {
  
    @IsString()
    @IsNotEmpty({ message: "CPF não pode ser vazio." })
    cpf: string;
  
    @IsDate()
    @IsNotEmpty({ message: "Data não pode ser vazia" })
    dataNascimento: Date;

    @IsString()
    @IsNotEmpty({ message: "Gênero não pode ser vazio." })
    genero: string;

    @IsString()
    @IsNotEmpty({ message: "Situação não pode ser vazia." })
    situacao: string;
}