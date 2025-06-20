import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MaxDate, Min, MinDate, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";
import { SegmentoInstituicao } from "../../enum/segmentoInstituicao.enum";

export class CriaInstituicaoDTO {

    @IsNumber({allowNaN:false}, {message:"Tipo do usuário não é compativel."})
    @IsNotEmpty({message: "Usuário não informado."})
    idUsuario: number;

    @IsString({message: "CNPJ tem tipo inválido."})
    @IsNotEmpty({message: "CNPJ não pode ser vazio."})
    cnpj: string;
    
    @IsDate({message:"DATA DE FUNDAÇÃO tem tipo inválido."})
    @MaxDate(new Date())
    @IsNotEmpty({message: "DATA DE FUNDAÇÃO não pode ser vazia."})
    dataFundacao: Date;

    @IsEnum(SegmentoInstituicao, {message:"SEGMENTO não está predefinido."})
    @IsNotEmpty({message: "SEGMENTO não pode ser vazio."})
    segmento?: SegmentoInstituicao

}