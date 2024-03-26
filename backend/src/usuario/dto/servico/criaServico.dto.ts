import { IsDate, IsNotEmpty, IsString,  } from "class-validator";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";

export class CriaServicoDto {

    @IsString()
    @IsNotEmpty({ message: "Titulo não pode ser vazio." })
    titulo: string;
  
    @IsString()
    @IsNotEmpty({ message: "Descricao não pode ser vazia." })
    descricao: string;
  
    @IsDate()
    @IsNotEmpty({ message: "Data não pode ser vazia" })
    dataServico: Date;

    @IsString()
    @IsNotEmpty({ message: "Status não pode ser vazio." })
    status: string;

    @IsNotEmpty({ message: "Usuário não reconhecido." })
    usuario: UsuarioEntity;
}