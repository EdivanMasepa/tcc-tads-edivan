import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class AtualizaInstituicaoDTO{
    @IsDate()
    @IsNotEmpty({ message: "Data não pode ser vazia" })
    dataFundacao?: Date;

    @IsString()
    @IsNotEmpty({ message: "Area de atuação não pode ser vazia." })
    areaAtuacao?: string;
}