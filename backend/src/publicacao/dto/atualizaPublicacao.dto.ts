import { IsOptional, IsString } from "class-validator";

export class AtualizaPublicacaoDTO{

    @IsString({message:'DESCRIÇÃO deve ser do tipo texto.'})
    descricao?:string;

}