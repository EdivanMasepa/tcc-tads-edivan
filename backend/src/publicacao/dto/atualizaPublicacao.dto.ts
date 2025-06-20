import { IsOptional, IsString } from "class-validator";

export class AtualizaPublicacaoDTO{

    @IsOptional()
    @IsString({message:'DESCRIÇÃO deve ser do tipo texto.'})
    descricao?:string;

}