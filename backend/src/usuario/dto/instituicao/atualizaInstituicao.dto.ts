import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SegmentoInstituicao } from "../../../enums/segmentoInstituicao.enum";

export class AtualizaInstituicaoDTO{
    
    @IsOptional()
    @IsDate({message:"DATA DE FUNDAÇÃO deve ser uma data válida."})
    dataFundacao?: string;

    @IsOptional()
    @IsEnum(SegmentoInstituicao, {message:"SEGMENTO não está predefinido."})
    segmento?: SegmentoInstituicao;
}