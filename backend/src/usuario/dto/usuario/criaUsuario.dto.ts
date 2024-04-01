import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CriaUsuarioDTO{
    @IsString()
    @IsNotEmpty({ message: "Tipo do usuário não informado." })
    tipoUsuario:string;
    
    @IsString()
    @IsNotEmpty({ message: "Nome não pode ser vazio." })
    nome: string;

    @IsString()
    @IsNotEmpty({ message: "Email não pode ser vazio." })
    email: string;

    @IsString()
    telefone: string;

    @IsString()
    @IsNotEmpty({ message: "Senha não pode ser vazia." })
    senha: string;
}