import { IsNotEmpty, IsString } from 'class-validator';
import { AtualizaPessoaDTO } from './pessoa/atualizaPessoa.dto';
import { AtualizaInstituicaoDTO } from './instituicao/atualizaInstituicao.dto';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';

export class AtualizaUsuarioDTO{

    @IsString()
    nome?: string;

    @IsString()
    email?: string;

    @IsString()
    telefone?: string;

    @IsString()
    senha?: string;

    @IsString()
    confirmacaoSenha?: string;

    @IsString()
    usuarioPessoa?: PessoaEntity;

    @IsString()
    usuarioInstituicao?:InstituicaoEntity;
}
