import { IsDate, IsNotEmpty, IsString,  } from "class-validator";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";
import { CategoriaPublicacao } from "../enum/categoriaPublicacao.enum";

export class CriaPublicacaoDTO {
        
    @IsString({message:"TIPO DA AÇÃO deve ser do tipo texto."})
    @IsNotEmpty({ message: "TIPO DA AÇÃO não pode ser vazio." })
    categoria: CategoriaPublicacao;
    
    @IsString({message:"TÍTULO deve ser do tipo texto."})
    @IsNotEmpty({ message: "TÍTULO não pode ser vazio." })
    titulo: string;

    @IsString({message:"DESCRIÇÃO deve ser do tipo texto."})
    @IsNotEmpty({ message: "DESCRIÇÃO não pode ser vazia." })
    descricao: string;

    @IsDate({message:"DATA deve ser do tipo DATA."})
    @IsNotEmpty({ message: "DATA não pode ser vazia" })
    data: Date;

    @IsNotEmpty({ message: "Usuário não reconhecido." })
    usuarioResponsavel: UsuarioEntity;
}