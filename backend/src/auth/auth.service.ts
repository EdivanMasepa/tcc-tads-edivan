import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService:UsuarioService, private readonly jwtService:JwtService){}

    async login(dadosLogin:LoginDTO){
        let usuario:UsuarioEntity;
        let usuarioEspecificacaoId:number;
        let senhaValida:boolean;
        let payload:any;

        usuario = await this.usuarioService.buscarEValidar(dadosLogin.login);

        if(dadosLogin.login.length < 5 || !(usuario instanceof UsuarioEntity))
            throw new UnauthorizedException('Login ou senha inválidos.')

        senhaValida = await bcrypt.compare(dadosLogin.senha, usuario.senha);
        
        if(!senhaValida)
            throw new UnauthorizedException('Login ou senha inválidos.')

        if(usuario.usuarioPessoa)
            usuarioEspecificacaoId = usuario.usuarioPessoa.id;
        else
            usuarioEspecificacaoId = usuario.usuarioInstituicao.id
            
        payload = {sub:usuario.id, email:usuario.email, especificacaoId:usuarioEspecificacaoId};
        
        return {
            token: this.jwtService.sign(payload),
            ok:true
        }
    }
}
