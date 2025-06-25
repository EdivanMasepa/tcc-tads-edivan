import { IsDate, IsInt, IsNumber, IsOptional } from "class-validator";

export class BuscaDenunciaDTO{

    @IsNumber({allowNaN: false}, {message:'Formato de busca inválida.'})
    @IsInt({message:'Formato de busca inválida.'})
    @IsOptional()
    id?:number;

    @IsNumber({allowNaN: false}, {message:'Formato de busca inválida.'})
    @IsInt({message:'Formato de busca inválida.'})
    @IsOptional()
    idPublicacao?: number;

    @IsNumber({allowNaN: false}, {message:'Formato de busca inválida.'})
    @IsInt({message:'Formato de busca inválida.'})
    @IsOptional()
    idUsuarioDenunciado?: number;

    @IsNumber({allowNaN: false}, {message:'Formato de busca inválida.'})
    @IsInt({message:'Formato de busca inválida.'})
    @IsOptional()
    idUsuarioRemetente?: number;

    @IsDate()
    @IsOptional()
    dataInicio?: Date;
 
    @IsDate()
    @IsOptional()
    dataFim?: Date;

}