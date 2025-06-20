import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MinDate } from "class-validator";

export class CriaDenunciaDTO {

    @IsString({message: 'DESCRIÇÃO deve ser do tipo TEXTO.'})
    @IsNotEmpty({message: 'DESCRIÇÃO não pode ser vazia.'})
    descricao: string;

    @IsDate()
    @MinDate(new Date(), {message: 'DATA deve ser a data atual'})
    @MaxDate(new Date(), {message: 'DATA deve ser a data atual'})
    @IsNotEmpty()
    data: Date;

    @IsNumber({allowNaN:false}, {message: 'Usuário remetente não relacionado.'})
    @IsNotEmpty({message: 'Usuário remetente não relacionado.'})
    idUsuarioRemetente: number;

    @IsNumber({allowNaN:false}, {message: 'Usuário denunciado não relacionado.'})
    @IsNotEmpty({message: 'Usuário denunciado não relacionado.'})
    idUsuarioDenunciado: number;
    
    @IsNumber({allowNaN:false}, {message: 'Publicação não relacionada.'})
    @IsOptional()
    idPublicacao: number;
}
