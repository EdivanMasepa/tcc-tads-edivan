import { IsNotEmpty, IsString } from "class-validator"

export class LoginDTO {

    @IsNotEmpty({message: 'LOGIN não informado.'})
    @IsString({message: 'LOGIN tem um tipo inválido.'})
    login: string;

    @IsNotEmpty({message: 'SENHA não informado.'})
    @IsString({message: 'SENHA tem um tipo inválido.'})
    senha:string;
}