import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class AtualizaServicoDTO{

    @IsString()
    titulo?:string;

    @IsString()
    descricao?:string;

    @IsString()
    status?: string;

    @IsDate()
    dataServico?: Date;
}