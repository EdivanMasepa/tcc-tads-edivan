import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AtualizaInstituicaoDTO{
    
    @IsOptional()
    @IsDate({message:"DATA DE FUNDAÇÃO deve ser uma data válida."})
    dataFundacao?: string;

    @IsOptional()
    @IsString({message:"ÁREA DE ATUAÇÃO deve ser do tipo texto."})
    areaAtuacao?: string;
}