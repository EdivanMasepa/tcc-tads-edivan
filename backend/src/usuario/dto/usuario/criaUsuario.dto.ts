import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CriaUsuarioDTO{
    @IsString({message: 'Tipo do usuário deve ser do tipo texto.'})
    @IsNotEmpty({message: 'Tipo do usuário não informado.'})
    tipoUsuario:string;
    
    @IsString({message: 'NOME deve ser do tipo texto.'})
    @IsNotEmpty({message: 'NOME não pode ser vazio.'})
    nome: string;

    @IsEmail({allow_display_name: false }, { message: 'EMAIL inválido.'})
    @IsNotEmpty({message: 'EMAIL não pode ser vazio.'})
    email: string;

    @IsString({message: 'TELEFONE deve ser do tipo texto.'})
    telefone: string;

    @IsString({message: 'SENHA deve ser do tipo texto.'})
    @IsNotEmpty({message: 'SENHA não pode ser vazia.'})
    senha: string;
}