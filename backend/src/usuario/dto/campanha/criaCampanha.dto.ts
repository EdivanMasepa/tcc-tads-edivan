import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";

export class CriaCamapanhaDTO{
    @IsString()
    @IsNotEmpty()
    objetivo: string;

    @IsString()
    @IsNotEmpty()
    publicoAlvo:string;

    @IsString()
    @IsNotEmpty()
    descricao: string;

    @IsString()
    @IsNotEmpty()
    dataInicial: Date;

    @IsDate()
    dataFinal:Date;

    @IsNotEmpty()
    usuarioPromovedor: UsuarioEntity;

    @IsArray()
    usuariosVoluntarios?: UsuarioEntity[];
}