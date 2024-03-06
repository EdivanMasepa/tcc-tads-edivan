import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { ListaUsuarioDTO } from './dto/listaUsuario.dto';
import { CriaUsuarioDto } from './dto/criaUsuario.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(UsuarioEntity) private readonly usuarioRepository: Repository<UsuarioEntity>,
  private jwtService: JwtService){}

  async criarUsuario(usuario: CriaUsuarioDto) {
    const usuarioEntity = new UsuarioEntity();
    const senhaHasheada = await bcrypt.hash(usuario.senha, 10);

    try{

      if(!this.validarCPF(usuario.cpf))
        return{message: "CPF inválido."}

      const buscarEmail = await this.usuarioRepository.findOne({where:{email : usuario.email}})
      if(buscarEmail)
        return{message: "Email inválido."}

      usuarioEntity.nome = usuario.nome;
      usuarioEntity.cpf = usuario.cpf;
      usuarioEntity.dataNascimento = usuario.dataNascimento;
      usuarioEntity.genero = usuario.genero;
      usuarioEntity.telefone = usuario.telefone;
      usuarioEntity.email = usuario.email;
      usuarioEntity.situacao = usuario.situacao;
      usuarioEntity.senha = senhaHasheada;

      const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);
  
      if(usuarioCriado){
        return{usuario: new ListaUsuarioDTO(
          usuarioEntity.id, usuarioEntity.nome, usuarioEntity.cpf, usuarioEntity.dataNascimento, 
          usuarioEntity.genero, usuarioEntity.telefone, usuarioEntity.email, usuarioEntity.situacao)};
      }else{
        return{Mensagem : 'Erro ao cadastrar.'}
      }
    }catch(erro){
      throw new BadRequestException;
    }
    
  }

  async listarUsuarios() {
    const usuarios = await this.usuarioRepository.find();
    const listaUsuarios = usuarios.map( 
      (usuario)=> new ListaUsuarioDTO(usuario.id, usuario.nome, usuario.cpf, usuario.dataNascimento, usuario.genero, usuario.telefone, usuario.email, usuario.situacao));
   
    return listaUsuarios;
  }

  async buscarUsuario(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({id : id});
    return usuarioEncontrado;
  }

  async alterarUsuario(id: number, novosDados: UsuarioEntity) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({id : id});
    if(usuarioEncontrado){
      try{
        const usuarioAtualizado = await this.usuarioRepository.update(usuarioEncontrado, novosDados)
        
        if(usuarioAtualizado)
          return await this.usuarioRepository.findOneBy({id : id});
        else
          return {Mensagem : 'Erro ao alterar cadastro.'};

      }catch(erro){
        throw new BadRequestException;
      }
    }else{
      return{Mensagem : "Usuário não encontrada."}
    }

  }

  async deletarUsuario(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({id : id});
    if(usuarioEncontrado){  
      try{
        await this.usuarioRepository.delete(id);
        return {'Usuário deletado': usuarioEncontrado};
      }catch(erro){
        throw new BadRequestException;
      }
    }else{
      return{Mensagem:'Usuaário não encontrado.'}
    }

  }

  validarCPF(cpf: string){
    let cpfLista = cpf.split('');
    let cpfnumero = [];
    let cpfVerifica = [];
    let soma = 0;
    let segundaSoma = 0;
    let primeiroDigitoVerificador: number;
    let segundoDigitoVerificador : number;
    let verifica = true;
    const listaSoma = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    const segundaListaSoma = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

    for(let i = 0; i < cpfLista.length; i++){
      cpfVerifica[i] = parseInt(cpfLista[i]);
    }
    
    for(let i = 0; i < (cpfLista.length - 2); i++){
      cpfnumero[i] = parseInt(cpfLista[i]);
      listaSoma[i] *= cpfnumero[i];
      soma += listaSoma[i];
    }

    if(soma % 11 < 2)
      primeiroDigitoVerificador = 0;
    else{
      primeiroDigitoVerificador = 11 - (soma % 11);
    }
    cpfnumero.push(primeiroDigitoVerificador);

    for(let i = 0; i < (cpfLista.length - 1); i++){
      segundaListaSoma[i] *= cpfnumero[i];
      segundaSoma += segundaListaSoma[i];
    }

    if(segundaSoma % 11 < 2)
      segundoDigitoVerificador = 0;
    else{
      segundoDigitoVerificador = 11 - (segundaSoma % 11);
    }

    cpfnumero.push(segundoDigitoVerificador);
    
    for(let i = 0; i < cpf.length; i++){

      if(cpfnumero[i] !== cpfVerifica[i])
        verifica = false
      if(!verifica)
        i =+ 10;
    }

    return verifica;
  }

  async login(email: string, senha: string){
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({email : email});
   
    if(usuarioEncontrado){  
      const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);

      if(senhaValida){
        const payload = {id:usuarioEncontrado.id, name:usuarioEncontrado.nome};

        return await this.gerarToken('token');

      }else{
        return {Mensagem : 'Senha incorreta.'};
      }
    }else{
      return{Mensagem : 'Email ou senha inválidos.'};
    }
  }

  async gerarToken(payload:string){
    return {
      access_token: this.jwtService.sign(
        { email: payload },
        {
          secret: '',
          expiresIn: '500000s',
        },
      ),
    };
  }
}