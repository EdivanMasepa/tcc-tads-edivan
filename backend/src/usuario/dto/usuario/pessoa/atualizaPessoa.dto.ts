import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AtualizaPessoaDTO{

    @IsDate()
    @IsNotEmpty({ message: "Data não pode ser vazia" })
    dataNascimento?: Date;

    @IsString()
    @IsNotEmpty({ message: "Gênero não pode ser vazio." })
    genero?: string;

    @IsString()
    @IsNotEmpty({ message: "Situação não pode ser vazia." })
    situacao?: string;
}
