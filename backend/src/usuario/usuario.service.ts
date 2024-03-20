import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { ListaUsuarioDTO } from './dto/listaUsuario.dto';
import { CriaUsuarioDto } from './dto/criaUsuario.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(UsuarioEntity) private readonly usuarioRepository: Repository<UsuarioEntity>){}

  async criarUsuario(usuario: CriaUsuarioDto) {
    const usuarioEntity = new UsuarioEntity();
    const senhaHasheada = await bcrypt.hash(usuario.senha, 10);

    if(!this.validarCPF(usuario.cpf))
      throw new BadRequestException('CPF inválido.')

    if(await this.buscarUsuario(usuario.email))
      throw new BadRequestException('Endereço de e-mail já cadastrado.')

    if(await this.buscarUsuario(usuario.telefone))
      throw new BadRequestException('Número de celular já cadastrado.')

    if(await this.buscarUsuario(usuario.cpf))
      throw new BadRequestException('CPF já cadastrado.')

    try{
      usuarioEntity.nome = usuario.nome;
      usuarioEntity.cpf = usuario.cpf;
      usuarioEntity.dataNascimento = usuario.dataNascimento;
      usuarioEntity.genero = usuario.genero;
      usuarioEntity.telefone = usuario.telefone;
      usuarioEntity.email = usuario.email;
      usuarioEntity.situacao = usuario.situacao;
      usuarioEntity.senha = senhaHasheada;

      const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);
  
      if(usuarioCriado)
        return{message: 'Usuário cadastrado com sucesso.'};
      
    }catch(erro){
      throw new BadRequestException('Erro ao cadastrar.');
    }
  }

  async listarUsuarios() {
    const usuarios = await this.usuarioRepository.find();

    if(!usuarios)
      throw new NotFoundException('Erro ao buscar usuários.')

    try{
      const listaUsuarios = usuarios.map( 
        (usuario)=> new ListaUsuarioDTO(usuario.id, usuario.nome, usuario.cpf, usuario.dataNascimento, usuario.genero, usuario.telefone, usuario.email, usuario.situacao));
     
      return listaUsuarios;
    }
    catch(erro){
      throw new NotFoundException('Erro ao listar usuários.')
    }
  }

  async validaBuscaUsuario(parametro: any){
    let usuarioBuscado:UsuarioEntity;

      usuarioBuscado = await this.usuarioRepository.findOneBy({id: parametro});
      
      if(!usuarioBuscado){
        usuarioBuscado = await this.usuarioRepository.findOneBy({cpf: parametro});
      
        if(!usuarioBuscado){
          usuarioBuscado = await this.usuarioRepository.findOneBy({email: parametro});
        
          if(!usuarioBuscado){
            usuarioBuscado = await this.usuarioRepository.findOneBy({telefone: parametro});
      
          }
        }
      }

      if(usuarioBuscado != null)
        return usuarioBuscado

      else
        return false
  }

  async buscarUsuario(parametro:any) {
    let usuarioBuscado = await this.validaBuscaUsuario(parametro)
    try{
      
      if(usuarioBuscado)
        return usuarioBuscado;
      else
        throw new NotFoundException('Nenhum cadastro localizado.');

    }catch(erro){
      throw erro
    }
  }

  async alterarUsuario(id: number, novosDados: UsuarioEntity) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({id : id});
    
    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.');

    const usuarioAtualizado = await this.usuarioRepository.update(usuarioEncontrado, novosDados)
        
    if(!usuarioAtualizado)
      throw new BadRequestException('Erro ao atualizar cadastro.');

    return {message: 'Cadastro atualizado.'}
  }

  async deletarUsuario(id: number) {
    const usuarioEncontrado = await this.usuarioRepository.findOneBy({id : id});
    
    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.')

    try{
      await this.usuarioRepository.delete(id);
      return 'Usuário deletado';

    }catch(erro){
      throw new BadRequestException('Erro ao excluir cadastro.');
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
}