import { IsNotEmpty, IsString } from "class-validator";

export class AlteraSenhaDTO{

    @IsNotEmpty()
    @IsString({message:'SENHA ANTIGA deve ser do tipo texto.'})
    senhaAntiga?: string;

    @IsNotEmpty()
    @IsString({message:'SENHA NOVA deve ser do tipo texto.'})
    senhaNova: string;

    @IsNotEmpty()
    @IsString({message:'CONFIRMAÇÃO DE SENHA deve ser do tipo texto.'})
    confirmaSenha: string;
}