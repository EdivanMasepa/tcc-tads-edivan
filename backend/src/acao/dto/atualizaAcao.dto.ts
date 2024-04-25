import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class AtualizaAcaoDTO{

    @IsString()
    titulo?:string;

    @IsString()
    status?: string;

    @IsDate()
    dataFinal?: Date;

    @IsString()
    descricao?:string;
}