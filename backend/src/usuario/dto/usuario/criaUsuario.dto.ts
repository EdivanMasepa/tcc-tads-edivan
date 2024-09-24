import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CriaUsuarioDTO{
    @IsString({message: "'Tipo do usuário' deve ser do tipo texto."})
    @IsNotEmpty({message: "Tipo do usuário não informado."})
    tipoUsuario:string;
    
    @IsString({message: "'Nome' deve ser do tipo texto."})
    @IsNotEmpty({message: "Nome não pode ser vazio."})
    nome: string;

    @IsEmail({allow_display_name: false }, { message: "Email inválido."})
    @IsNotEmpty({message: "Email não pode ser vazio."})
    email: string;

    @IsString({message: "'Telefone' deve ser do tipo texto."})
    telefone: string;

    @IsString({message: "'Senha' deve ser do tipo texto."})
    @IsNotEmpty({message: "Senha não pode ser vazia."})
    senha: string;
}