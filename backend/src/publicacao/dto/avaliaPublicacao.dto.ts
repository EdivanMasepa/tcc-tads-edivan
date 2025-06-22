import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AvaliaPublicacaoDTO {

    @IsNotEmpty({message: 'ID da publicação é obrigatório.'})
    @IsNumber({allowNaN: false},{message: 'ID da publicação deve ser um número.'})
    idPublicacao: number;
    
    @IsBoolean({message: 'Tipo de dado inválido para avaliar a publicação.'})
    @IsOptional()
    aprovada: boolean;
}