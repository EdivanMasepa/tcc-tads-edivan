import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AtualizaPessoaDTO } from './pessoa/atualizaPessoa.dto';
import { AtualizaInstituicaoDTO } from './instituicao/atualizaInstituicao.dto';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';

export class AtualizaUsuarioDTO{
    @IsOptional()
    @IsString({message:'"Nome" deve ser do tipo texto.'})
    nome?: string;

    @IsOptional()
    @IsEmail({allow_display_name:false}, {message:'Email inváldo.'})
    email?: string;

    @IsOptional()
    @IsString({message:'"Telefone" deve ser do tipo texto.'})
    telefone?: string;

    @IsOptional()
    @IsString({message:'"senha" deve ser do tipo texto.'})
    senha?: string;

    @IsOptional()
    usuarioPessoa?: PessoaEntity;

    @IsOptional()
    usuarioInstituicao?:InstituicaoEntity;
}
