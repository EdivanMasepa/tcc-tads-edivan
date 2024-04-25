import { IsDate, IsNotEmpty, IsString,  } from "class-validator";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";

export class CriaAcaoDto {
    
    @IsString()
    @IsNotEmpty({ message: "Titulo não pode ser vazio." })
    tipoAcao:string;

    @IsString()
    @IsNotEmpty({ message: "Titulo não pode ser vazio." })
    titulo: string;

    @IsString()
    @IsNotEmpty({ message: "Status não pode ser vazio." })
    status: string;
  
    @IsDate()
    @IsNotEmpty({ message: "Data não pode ser vazia" })
    dataInicial: Date;

    @IsDate()
    dataFinal: Date;

    @IsString()
    @IsNotEmpty({ message: "Descricao não pode ser vazia." })
    descricao: string;

    @IsNotEmpty({ message: "Usuário não reconhecido." })
    usuario: UsuarioEntity;
}