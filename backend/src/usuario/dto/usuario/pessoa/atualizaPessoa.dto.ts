import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AtualizaPessoaDTO{

    @IsOptional()
    @IsNumber({allowNaN:false}, {message: "Erro no usuário."})
    idUsuario?: number;

    @IsOptional()
    @IsString({message:"CPF inválido."})
    cpf?: string;

    @IsOptional()
    @IsDate({message:"DATA DE NASCIMENTO deve ser uma data válida."})
    dataNascimento?: string;

    @IsOptional()
    @IsString({message:"GÊNERO deve ser do tipo texto."})
    genero?: string;

    @IsOptional()
    @IsString({message:"SITUAÇÃO deve ser do tipo texto."})
    situacao?: string;
}
