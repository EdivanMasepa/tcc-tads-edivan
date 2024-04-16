import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class AtualizaPessoaDTO{

    @IsDate()
    dataNascimento?: Date;

    @IsString()
    genero?: string;

    @IsString()
    situacao?: string;
}
