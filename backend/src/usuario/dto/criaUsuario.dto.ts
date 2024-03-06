import { IsDate, IsNotEmpty, IsNumber, IsString, Min, isNotEmpty } from "class-validator";

export class CriaUsuarioDto {

    @IsString()
    @IsNotEmpty({ message: "Nome não pode ser vazio." })
    nome: string;
  
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
    @IsNotEmpty({ message: "Telefone não pode ser vazio." })
    telefone: string;

    @IsString()
    @IsNotEmpty({ message: "Email não pode ser vazio." })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Situação não pode ser vazia." })
    situacao: string;

    @IsString()
    @IsNotEmpty({ message: "Senha não pode ser vazia." })
    senha: string;
}