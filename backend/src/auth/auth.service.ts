import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usuarioService:UsuarioService, private readonly jwtService:JwtService){}

    async login(loginUsuario:string, senha:string){
        let usuario

        if(!await this.usuarioService.buscarUsuario(loginUsuario))
        throw new BadRequestException('Login inválido')
    
        usuario = await this.usuarioService.buscarUsuario(loginUsuario)
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!senhaValida)
            throw new BadRequestException('Login inválido')

        const payload = {sub:usuario.id, email:usuario.email};

        return {
            token: this.jwtService.sign(payload)
        };
    }
}
