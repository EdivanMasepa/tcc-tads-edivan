import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength, ValidateNested } from 'class-validator';
import { AtualizaPessoaDTO } from './pessoa/atualizaPessoa.dto';
import { AtualizaInstituicaoDTO } from './instituicao/atualizaInstituicao.dto';
import { Type } from 'class-transformer';


export class AtualizaUsuarioDTO{
    
    @IsOptional()
    @IsString({message:'NOME deve ser do tipo texto.'})
    @MinLength(5, {message:'NOME deve ter no mínimo 5 caracteres'})
    nome?: string;

    @IsOptional()
    @IsEmail({allow_display_name:false}, {message:'EMAIL inválido.'})
    email?: string;

    @IsOptional()
    @IsString({message:'TELEFONE tem tipo inválido.'})
    @IsPhoneNumber('BR', {message: 'Número de telefone inválido.'})
    telefone?: string;

    @ValidateNested() 
    @Type(() => AtualizaPessoaDTO)
    pessoa?: AtualizaPessoaDTO;

    @ValidateNested()
    @Type(() => AtualizaInstituicaoDTO)
    instituicao?: AtualizaInstituicaoDTO;
}
