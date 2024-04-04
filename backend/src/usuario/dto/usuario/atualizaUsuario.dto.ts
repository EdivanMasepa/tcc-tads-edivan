import { IsNotEmpty, IsString } from 'class-validator';
import { AtualizaPessoaDTO } from './pessoa/atualizaPessoa.dto';
import { AtualizaInstituicaoDTO } from './instituicao/atualizaInstituicao.dto';

export class AtualizaUsuarioDTO{

    @IsString()
    @IsNotEmpty({ message: "Nome não pode ser vazia" })
    nome?: string;

    @IsString()
    @IsNotEmpty({ message: "E-mail não pode ser vazio." })
    email?: string;

    @IsString()
    @IsNotEmpty({ message: "Telefone não pode ser vazia." })
    telefone?: string;

    @IsString()
    @IsNotEmpty({ message: "Senha não pode ser vazia." })
    senha?: string;

    @IsString()
    @IsNotEmpty({ message: "Confirmação de senha não pode ser vazia." })
    confirmacaoSenha?: string;

    @IsString()
    especificacoes?: Partial<AtualizaPessoaDTO | AtualizaInstituicaoDTO>
}
