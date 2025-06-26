import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MinLength, ValidateNested } from "class-validator";
import { CriaPessoaDTO } from "./pessoa/criaPessoa.dto";
import { CriaInstituicaoDTO } from "./instituicao/criaInstituicao.dto";
import { TipoUsuarioEnum } from "../enum/tipoUsuario.enum";
import { Type } from "class-transformer";

export class CriaUsuarioDTO{
    
   // @IsEnum({message: 'Tipo do usuário não está predefinido.'})
    @IsNotEmpty({message: 'Tipo do usuário não informado.'})
    tipoUsuario:TipoUsuarioEnum;
    
    @IsString({message: 'NOME deve ser do tipo texto.'})
    @IsNotEmpty({message: 'NOME não pode ser vazio.'})
    @MinLength(5, {message:'NOME deve ter no mínimo 5 caracteres'})
    nome: string;

    @IsEmail({allow_display_name: false }, { message: 'EMAIL inválido.'})
    @IsNotEmpty({message: 'EMAIL não pode ser vazio.'})
    email: string;

    @IsString({message: 'TELEFONE deve ser do tipo texto.'})
    @IsPhoneNumber('BR', {message: 'Número de telefone inválido.'})
    @IsOptional()
    telefone: string;

    @IsString({message: 'SENHA deve ser do tipo texto.'})
    @IsNotEmpty({message: 'SENHA não pode ser vazia.'})
    senha: string;

    @IsString({message: 'CONFIRMAÇÃO DE SENHA deve ser do tipo texto.'})
    @IsNotEmpty({message: 'CONFIRMAÇÃO DE SENHA não pode ser vazia.'})
    confirmaSenha: string;

    @ValidateNested() 
    @Type(() => Object)
    pessoa?: CriaPessoaDTO;

    @ValidateNested()
    @Type(() => CriaInstituicaoDTO)
    instituicao?: CriaInstituicaoDTO;
    
}