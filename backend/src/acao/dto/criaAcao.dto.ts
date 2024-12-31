import { IsDate, IsNotEmpty, IsString,  } from "class-validator";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";

export class CriaAcaoDto {
    
    @IsString({message:"TIPO DA AÇÃO deve ser do tipo texto."})
    @IsNotEmpty({ message: "TIPO DA AÇÃO não pode ser vazio." })
    tipoAcao:string;

    @IsString({message:"TÍTULO deve ser do tipo texto."})
    @IsNotEmpty({ message: "TÍTULO não pode ser vazio." })
    titulo: string;

    @IsString({message:"STATUS deve ser do tipo texto."})
    @IsNotEmpty({ message: "STATUS não pode ser vazio." })
    status: string;    

    @IsDate({message:"DATA INICIAL deve ser do tipo texto."})
    @IsNotEmpty({ message: "DATA INICIAL não pode ser vazia" })
    dataInicial: string;

    @IsDate({message:"DATA FINAL deve ser do tipo texto."})
    @IsNotEmpty({ message: "DATA FINAL não pode ser vazia" })
    dataFinal: string;

    @IsString({message:"DESCRIÇÃO deve ser do tipo texto."})
    @IsNotEmpty({ message: "DESCRIÇÃO não pode ser vazia." })
    descricao: string;

    @IsNotEmpty({ message: "Usuário não reconhecido." })
    usuarioResponsavel: UsuarioEntity;
}