import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class AtualizaInstituicaoDTO{
    
    @IsDate()
    dataFundacao?: Date;

    @IsString()
    areaAtuacao?: string;
}