import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoaEntity } from './entities/pessoa.entity';
import { ListaPessoaDTO } from './dto/usuario/pessoa/listaPessoa.dto';
import { CriaPessoaDto } from './dto/usuario/pessoa/criaPessoa.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CriaServicoDto } from './dto/servico/criaServico.dto';
import { ServicoEntity } from './entities/servico.entity';
import { ListaServicosDTO } from './dto/servico/listaServicos.dto';
import { AtualizaPessoaDTO } from './dto/usuario/pessoa/atualizaPessoa.dto';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { CriaInstituicaoDto } from './dto/usuario/instituicao/criaInstituicao.dto';
import { ListaInstituicaoDTO } from './dto/usuario/instituicao/listaInstituicao.dto';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(PessoaEntity) private readonly usuarioPessoaRepository: Repository<PessoaEntity>,
              @InjectRepository(InstituicaoEntity) private readonly usuarioInstituicaoRepository: Repository<InstituicaoEntity>,
              @InjectRepository(ServicoEntity) private readonly servicoRepository: Repository<ServicoEntity>){}

  async criarUsuario(usuarioPessoa?: CriaPessoaDto, usuarioInstituicao?: CriaInstituicaoDto) {
    const usuarioPessoaEntity = new PessoaEntity();
    const usuarioInstituicaoEntity = new InstituicaoEntity();

    if(usuarioPessoa){
      const senhaHasheada = await bcrypt.hash(usuarioPessoa.senha, 10);

      if(!this.validarCPF(usuarioPessoa.cpf))
        throw new BadRequestException('CPF inválido.')
  
      if(await this.validaBuscaUsuario(usuarioPessoa.email, 1))
        throw new BadRequestException('Endereço de e-mail já cadastrado.')
  
      if(await this.validaBuscaUsuario(usuarioPessoa.telefone, 1))
        throw new BadRequestException('Número de celular já cadastrado.')
  
      if(await this.validaBuscaUsuario(usuarioPessoa.cpf, 1))
        throw new BadRequestException('CPF já cadastrado.')
  
      try{
        usuarioPessoaEntity.cpf = usuarioPessoa.cpf;
        usuarioPessoaEntity.dataNascimento = usuarioPessoa.dataNascimento;
        usuarioPessoaEntity.nome = usuarioPessoa.nome;
        usuarioPessoaEntity.genero = usuarioPessoa.genero;
        usuarioPessoaEntity.telefone = usuarioPessoa.telefone;
        usuarioPessoaEntity.email = usuarioPessoa.email;
        usuarioPessoaEntity.situacao = usuarioPessoa.situacao;
        usuarioPessoaEntity.senha = senhaHasheada;
  
        const usuarioCriado = await this.usuarioPessoaRepository.save(usuarioPessoaEntity);
    
        if(usuarioCriado)
          return{message: 'Usuário cadastrado com sucesso.'};
        
      }catch(erro){
        throw new BadRequestException('Erro ao cadastrar.');
      }
    }
    else if(usuarioInstituicao){
     
      const senhaHasheada = await bcrypt.hash(usuarioInstituicao.senha, 10);
  
      if(await this.validaBuscaUsuario(usuarioInstituicao.email, 2))
        throw new BadRequestException('Endereço de e-mail já cadastrado.')
  
      if(await this.validaBuscaUsuario(usuarioInstituicao.telefone, 2))
        throw new BadRequestException('Número de celular já cadastrado.')
  
      if(await this.validaBuscaUsuario(usuarioInstituicao.cnpj, 2))
        throw new BadRequestException('CNPJ já cadastrado.')
  
      try{
        usuarioInstituicaoEntity.cnpj = usuarioInstituicao.cnpj;
        usuarioInstituicaoEntity.dataFundacao = usuarioInstituicao.dataFundacao;
        usuarioInstituicaoEntity.nome = usuarioInstituicao.nome;
        usuarioInstituicaoEntity.areaAtuacao = usuarioInstituicao.areaAtuacao;
        usuarioInstituicaoEntity.telefone = usuarioInstituicao.telefone;
        usuarioInstituicaoEntity.email = usuarioInstituicao.email;
        usuarioInstituicaoEntity.senha = senhaHasheada;
  
        const usuarioCriado = await this.usuarioInstituicaoRepository.save(usuarioInstituicaoEntity);
    
        if(usuarioCriado)
          return{message: 'Usuário cadastrado com sucesso.'};
        else
          throw new BadRequestException('Não foi possivel concluir o cadastro. Verifique os dados informados.')
        
      }catch(erro){
        throw erro;
      }
    }
  }

  async listarUsuarios() {
    const usuariosPessoas = await this.usuarioPessoaRepository.find({relations:{solicitacoesDeServicos:true}});
    const usuariosInstituicoes = await this.usuarioInstituicaoRepository.find();

    if(!usuariosPessoas || !usuariosInstituicoes)
      throw new NotFoundException('Erro ao buscar usuários.')
 
    try{
      const listaUsuariosPessoas = usuariosPessoas.map( 
        (usuario)=> new ListaPessoaDTO(usuario.id, usuario.nome, usuario.email, usuario.telefone, usuario.cpf, usuario.dataNascimento, usuario.genero, usuario.situacao, usuario.solicitacoesDeServicos.length));
      const listaUsuariosInstituicoes = usuariosInstituicoes.map( 
        (usuario)=> new ListaInstituicaoDTO(usuario.id, usuario.nome, usuario.email, usuario.telefone, usuario.cnpj, usuario.dataFundacao,  usuario.areaAtuacao));
     
      return {Pessoas: listaUsuariosPessoas, Instituições: listaUsuariosInstituicoes};
    }
    catch(erro){
      throw new NotFoundException('Erro ao listar usuários.')
    }
  }

  async validaBuscaUsuario(parametro: any, tipoUsuario: number){
    let usuarioPessoa:PessoaEntity;
    let usuarioInstituicao:InstituicaoEntity;

    if(tipoUsuario === 1){

      usuarioPessoa = await this.usuarioPessoaRepository.findOneBy({id: parametro});
        
      if(!usuarioPessoa){
        usuarioPessoa = await this.usuarioPessoaRepository.findOneBy({cpf: parametro});
      
        if(!usuarioPessoa){
          usuarioPessoa = await this.usuarioPessoaRepository.findOneBy({email: parametro});
        
          if(!usuarioPessoa){
            usuarioPessoa = await this.usuarioPessoaRepository.findOneBy({telefone: parametro});
          }
        }
      }
      if(usuarioPessoa != null)
        return usuarioPessoa

      else
        return false
    }

    else if( tipoUsuario === 2){

      usuarioInstituicao = await this.usuarioInstituicaoRepository.findOneBy({id: parametro});

      if(!usuarioInstituicao){
        usuarioInstituicao = await this.usuarioInstituicaoRepository.findOneBy({cnpj: parametro});
      
        if(!usuarioInstituicao){
          usuarioInstituicao = await this.usuarioInstituicaoRepository.findOneBy({email: parametro});
        
          if(!usuarioInstituicao){
            usuarioInstituicao = await this.usuarioInstituicaoRepository.findOneBy({telefone: parametro});
          }
        }
      }

      if(usuarioInstituicao != null)
        return usuarioInstituicao

      else
        return false
    }
  }

  async buscarUsuario(parametro:any) {  
    try{
      let usuarioBuscado = await this.validaBuscaUsuario(parametro, 1)
      
      if(usuarioBuscado)
        return usuarioBuscado;
      else
        usuarioBuscado = await this.validaBuscaUsuario(parametro, 2)

      if(usuarioBuscado)
        return usuarioBuscado;
      else
        throw new NotFoundException('Nenhum cadastro localizado.');

    }catch(erro){
      throw erro
    }
  }

  async alterarUsuario(idUsuario: number, novosDados: AtualizaPessoaDTO) {
    const usuarioEncontrado = await this.usuarioPessoaRepository.findOneBy({id : idUsuario});

    if('cpf' in  novosDados || 'email' in  novosDados || 'telefone' in  novosDados || 'senha' in  novosDados)
      throw new NotFoundException('Dados não podem ser atualizados.');

    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.');

    const usuarioAtualizado = await this.usuarioPessoaRepository.update(usuarioEncontrado, novosDados)
        
    if(!usuarioAtualizado)
      throw new BadRequestException('Erro ao atualizar cadastro.');

    return {message: 'Cadastro atualizado.'}
  }

  async deletarUsuario(id: number) {
    const usuarioEncontrado = await this.usuarioPessoaRepository.findOneBy({id : id});
    
    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.')

    try{
      await this.usuarioPessoaRepository.delete(id);
      return 'Usuário deletado';

    }catch(erro){
      throw new BadRequestException('Erro ao excluir cadastro.');
    }

  }

  async criarServico(idUsuario: number, servico:CriaServicoDto){
    const usuarioEncontrado:PessoaEntity = await this.usuarioPessoaRepository.findOne({where:{id : idUsuario}, relations:{solicitacoesDeServicos:true}});
    
    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.');

    const servicoEntity = new ServicoEntity();

    servicoEntity.titulo = servico.titulo
    servicoEntity.descricao = servico.descricao
    servicoEntity.dataServico = servico.dataServico
    servicoEntity.status = servico.status
    servicoEntity.usuario = usuarioEncontrado
    
    await this.servicoRepository.save(servicoEntity)

    return {message: 'Servico criado com sucesso.'}
  
  }

  async listarServicos(){
    const listaServico= await this.servicoRepository.find({relations:{usuario:true}})
    const servicos = listaServico.map( 
      (servico)=> new ListaServicosDTO(servico.id, servico.titulo, servico.descricao, servico.dataServico, servico.status, servico.usuario.nome));
     
    return servicos;
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