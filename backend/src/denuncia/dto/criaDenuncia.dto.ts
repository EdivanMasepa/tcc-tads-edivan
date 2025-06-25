import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MinDate } from "class-validator";

export class CriaDenunciaDTO {

    @IsString({message: 'DESCRIÇÃO deve ser do tipo TEXTO.'})
    @IsNotEmpty({message: 'DESCRIÇÃO não pode ser vazia.'})
    descricao: string;

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
