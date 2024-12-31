import { IsDate, IsNotEmpty, IsNumber, IsString, Min, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";

export class CriaInstituicaoDTO extends CriaUsuarioDTO {

    @IsNumber({allowNaN:false}, {message:"Tipo do usuário não é compativel."})
    @IsNotEmpty({message: "Usuário não informado."})
    idUsuario: number;

    @IsString({message: "CNPJ tem tipo inválido."})
    @IsNotEmpty({message: "CNPJ não pode ser vazio."})
    cnpj: string;
    
    @IsString({message:"DATA DE FUNDAÇÃO tem tipo inválido."})
    @IsNotEmpty({message: "DATA DE FUNDAÇÃO não pode ser vazia."})
    dataFundacao: string;

    @IsString({message: "ÁREA DE ATUAÇÃO deve ser do tipo texto."})
    @IsNotEmpty({message: "ÁREA DE ATUAÇÃO não pode ser vazio."})
    areaAtuacao: string;
}