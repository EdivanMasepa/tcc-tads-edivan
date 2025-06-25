import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AtualizaPessoaDTO } from './pessoa/atualizaPessoa.dto';
import { AtualizaInstituicaoDTO } from './instituicao/atualizaInstituicao.dto';
import { Type } from 'class-transformer';


export class AtualizaUsuarioDTO{
    @IsOptional()
    @IsString({message:'NOME deve ser do tipo texto.'})
    nome?: string;

    @IsOptional()
    @IsEmail({allow_display_name:false}, {message:'EMAIL inválido.'})
    email?: string;

    @IsOptional()
    @IsString({message:'TELEFONE tem tipo inválido.'})
    telefone?: string;

    @ValidateNested() 
    @Type(() => Object)
    @IsOptional()
    pessoa?: AtualizaPessoaDTO;

    @ValidateNested()
    @Type(() => Object)
    @IsOptional()
    instituicao?: AtualizaInstituicaoDTO;
}
