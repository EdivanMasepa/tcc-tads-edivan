import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AlteraSenhaDTO {

    @IsNumber({allowNaN: false}, {message: 'CODIGO deve ser um número.'})
    @IsInt({message: 'CODIGO deve ser um número inteiro.'})
    @IsOptional()
    codigo?: number;

    @IsNotEmpty({message: 'SENHA ATUAL é obrigatória.'})
    @IsString({message: 'SENHA ATUAL deve ser do tipo texto.'})
    senhaAtual: string;

    @IsNotEmpty({message: 'NOVA SENHA é obrigatória.'})
    @IsString({message: 'NOVA SENHA deve ser do tipo texto.'})
    senhaNova: string;

    @IsNotEmpty({message: 'CONFIRMA NOVA SENHA é obrigatória.'})
    @IsString({message: 'CONFIRMA NOVA SENHA deve ser do tipo texto.'})
    confirmaSenhaNova: string;
}