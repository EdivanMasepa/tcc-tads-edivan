import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AtualizaAcaoDTO{

    @IsOptional()
    @IsString({message:'STATUS deve ser do tipo texto.'})
    status?: string;

    @IsOptional()
    @IsString({message:'TITULO deve ser do tipo texto.'})
    titulo?:string;

    @IsOptional()
    @IsString({message:'DESCRIÇÃO deve ser do tipo texto.'})
    descricao?:string;

    @IsOptional()
    @IsDate({message:'DATA FINAL deve ser do tipo texto.'})
    dataFinal?: string;
}