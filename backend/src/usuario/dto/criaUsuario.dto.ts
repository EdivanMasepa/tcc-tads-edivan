import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, ValidateNested } from "class-validator";
import { CriaPessoaDTO } from "./pessoa/criaPessoa.dto";
import { CriaInstituicaoDTO } from "./instituicao/criaInstituicao.dto";
import { TipoUsuario } from "../../enums/tipoUsuario.enum";
import { Type } from "class-transformer";

export class CriaUsuarioDTO{
    
    @IsEnum({message: 'Tipo do usuário não está predefinido.'})
    @IsNotEmpty({message: 'Tipo do usuário não informado.'})
    tipoUsuario:TipoUsuario;
    
    @IsString({message: 'NOME deve ser do tipo texto.'})
    @IsNotEmpty({message: 'NOME não pode ser vazio.'})
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
    @Type(() => CriaPessoaDTO)
    @IsOptional()
    pessoa?: CriaPessoaDTO;

    @ValidateNested()
    @Type(() => CriaInstituicaoDTO)
    @IsOptional()
    instituicao?: CriaInstituicaoDTO;
    
}