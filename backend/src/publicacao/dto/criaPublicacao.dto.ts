import { IsDate, IsEnum, IsNotEmpty, IsString,  } from "class-validator";
import { UsuarioEntity } from "src/usuario/entities/usuario.entity";
import { CategoriaPublicacaoEnum } from "../enum/categoriaPublicacao.enum";

export class CriaPublicacaoDTO {
        
    //@IsEnum({message: 'CATEGORIA não está predefinido.'})
    @IsNotEmpty({ message: "CATEGORIA não pode ser vazio." })
    categoria: CategoriaPublicacaoEnum;
    
    @IsString({message:"TÍTULO deve ser do tipo texto."})
    @IsNotEmpty({ message: "TÍTULO não pode ser vazio." })
    titulo: string;

    @IsString({message:"DESCRIÇÃO deve ser do tipo texto."})
    @IsNotEmpty({ message: "DESCRIÇÃO não pode ser vazia." })
    descricao: string;
}