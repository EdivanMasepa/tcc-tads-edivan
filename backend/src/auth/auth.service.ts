import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { PessoaEntity } from 'src/usuario/entities/pessoa.entity';
import { InstituicaoEntity } from 'src/usuario/entities/instituicao.entity';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService:UsuarioService, private readonly jwtService:JwtService){}

    async login(loginUsuario:string, senha:string){
        let usuario:UsuarioEntity;
        let usuarioEspecificacaoId:number;
        let senhaValida:boolean;
        let payload:any;

        usuario = await this.usuarioService.buscarUsuario(loginUsuario);

        senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!usuario || !senhaValida || loginUsuario.length < 10)
            throw new BadRequestException('Login inválido')

        if(usuario instanceof UsuarioEntity){

            if(usuario.usuarioPessoa)
                usuarioEspecificacaoId = usuario.usuarioPessoa.id;
            else
                usuarioEspecificacaoId = usuario.usuarioInstituicao.id
        }else
            throw new NotFoundException

        payload = {sub:usuario.id, email:usuario.email, especificacaoId:usuarioEspecificacaoId};

        return {
            token: this.jwtService.sign(payload)
        };
    }
}
