import { IsDate, IsNotEmpty, IsNumber, IsString, Min, isNotEmpty } from "class-validator";
import { CriaUsuarioDTO } from "../criaUsuario.dto";

export class CriaInstituicaoDTO extends CriaUsuarioDTO {

    @IsNumber()
    @IsNotEmpty({ message: "id do usuário não informado." })
    idUsuario: number;

    @IsString()
    @IsNotEmpty({ message: "CNPJ não pode ser vazio." })
    cnpj: string;
    
    @IsDate()
    @IsNotEmpty({ message: "Data de fundação não pode ser vazia" })
    dataFundacao: Date;

    @IsString()
    @IsNotEmpty({ message: "Propósito não pode ser vazio." })
    areaAtuacao: string;
}