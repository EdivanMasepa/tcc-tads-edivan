import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoaEntity } from './entities/pessoa.entity';
import { ListaPessoaDTO } from './dto/usuario/pessoa/listaPessoa.dto';
import { CriaPessoaDTO } from './dto/usuario/pessoa/criaPessoa.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CriaServicoDto } from './dto/servico/criaServico.dto';
import { ServicoEntity } from './entities/servico.entity';
import { ListaServicosDTO } from './dto/servico/listaServicos.dto';
import { AtualizaPessoaDTO } from './dto/usuario/pessoa/atualizaPessoa.dto';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { CriaInstituicaoDTO } from './dto/usuario/instituicao/criaInstituicao.dto';
import { ListaInstituicaoDTO } from './dto/usuario/instituicao/listaInstituicao.dto';
import { CriaUsuarioDTO } from './dto/usuario/criaUsuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { ListaUsuarioDTO } from './dto/usuario/listaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/usuario/atualizaUsuario.dto';
import { AtualizaInstituicaoDTO } from './dto/usuario/instituicao/atualizaInstituicao.dto';
import { use } from 'passport';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(UsuarioEntity) private readonly usuarioRepository: Repository<UsuarioEntity>,
              @InjectRepository(PessoaEntity) private readonly usuarioPessoaRepository: Repository<PessoaEntity>,
              @InjectRepository(InstituicaoEntity) private readonly usuarioInstituicaoRepository: Repository<InstituicaoEntity>,
              @InjectRepository(ServicoEntity) private readonly servicoRepository: Repository<ServicoEntity>){}

  async criarUsuario(usuario: CriaUsuarioDTO, usuarioPessoa?: CriaPessoaDTO, usuarioInstituicao?: CriaInstituicaoDTO){
    const usuarioEntity= new UsuarioEntity();
    const usuarioPessoaEntity = new PessoaEntity();
    const usuarioInstituicaoEntity = new InstituicaoEntity();

    try{
      const senhaHasheada = await bcrypt.hash(usuario.senha, 10);
    
      if(await this.validaBuscaUsuario(usuario.email))
        throw new BadRequestException('Endereço de e-mail já cadastrado.')

      if(await this.validaBuscaUsuario(usuario.telefone))
        throw new BadRequestException('Número de celular já cadastrado.')

      usuarioEntity.tipoUsuario = usuario.tipoUsuario,
      usuarioEntity.nome = usuario.nome;
      usuarioEntity.email = usuario.email;
      usuarioEntity.telefone = usuario.telefone;
      usuarioEntity.senha = senhaHasheada;

      if(usuarioPessoa != null){

        if(!this.validarCPF(usuarioPessoa.cpf))
          throw new BadRequestException('CPF inválido.')

        if(await this.validaBuscaUsuario(usuarioPessoa.cpf))
          throw new BadRequestException('CPF já cadastrado.')

        const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);

        usuarioPessoaEntity.idUsuario = usuarioCriado.id;
        usuarioPessoaEntity.cpf = usuarioPessoa.cpf;
        usuarioPessoaEntity.dataNascimento = usuarioPessoa.dataNascimento;
        usuarioPessoaEntity.genero = usuarioPessoa.genero;
        usuarioPessoaEntity.situacao = usuarioPessoa.situacao;

        const usuarioPessoaCriado = await this.usuarioPessoaRepository.save(usuarioPessoaEntity);    

        if(usuarioPessoaCriado){
          usuarioCriado.usuarioPessoa = usuarioPessoaCriado;

          await this.usuarioRepository.save(usuarioCriado);

          return{message: 'Usuário cadastrado com sucesso.'};
          
        }else
          throw new BadRequestException('Erro ao cadastrar.')
      }    
      else if(usuarioInstituicao != null){

        if(await this.validaBuscaUsuario(usuarioInstituicao.cnpj))
          throw new BadRequestException('CNPJ já cadastrado.')

        const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);

        usuarioInstituicaoEntity.idUsuario = usuarioEntity.id;
        usuarioInstituicaoEntity.cnpj = usuarioInstituicao.cnpj;
        usuarioInstituicaoEntity.dataFundacao = usuarioInstituicao.dataFundacao;
        usuarioInstituicaoEntity.areaAtuacao = usuarioInstituicao.areaAtuacao;

        const usuarioInstituicaoCriado = await this.usuarioInstituicaoRepository.save(usuarioInstituicaoEntity);

        if(usuarioInstituicaoCriado){
          usuarioCriado.usuarioInstituicao = usuarioInstituicaoEntity;

          await this.usuarioRepository.save(usuarioCriado);

          return{message: 'Usuário cadastrado com sucesso.'};

        }else
          throw new BadRequestException('Erro ao cadastrar.')
    }      
    }catch(erro){
      throw erro
    }
  }

  async listarUsuarios(opcao: number) {
    const usuarios = await this.usuarioRepository.find({relations: ['usuarioPessoa', 'solicitacoesDeServicos', 'usuarioInstituicao']})
    const usuariosPessoas = await this.usuarioPessoaRepository.find();
    const usuariosInstituicoes = await this.usuarioInstituicaoRepository.find();

    if(!usuariosPessoas || !usuariosInstituicoes)
      throw new NotFoundException('Erro ao buscar usuários.')
 
    try{
      if(opcao === 1){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'pessoa'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, new ListaPessoaDTO(usuario.usuarioPessoa.id, 
              usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao, usuario.solicitacoesDeServicos.length))
          }else if(usuario.tipoUsuario === 'instituicao'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, 
              usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.areaAtuacao))
          }
        }) 
      }else if(opcao === 2){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'pessoa'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, new ListaPessoaDTO(usuario.usuarioPessoa.id, 
              usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao, usuario.solicitacoesDeServicos.length))
          }
        }) 
      }else if(opcao === 3){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'instituicao'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, 
              usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.areaAtuacao))
          }
        }) 
      }else
        throw new NotFoundException('Opção inválida.')
    }
    catch(erro){
      throw erro
    }
  }

  async validaBuscaUsuario(parametro: any){
    let usuario:UsuarioEntity;
    let usuarioPessoa:PessoaEntity;
    let usuarioInstituicao:InstituicaoEntity;

    usuario = await this.usuarioRepository.findOne({where:{id: parametro}, relations:['usuarioPessoa', 'usuarioInstituicao']});
  
    if(!usuario){
      usuario = await this.usuarioRepository.findOne({where:{email: parametro}, relations:['usuarioPessoa', 'usuarioInstituicao']});

      if(!usuario){
        usuario = await this.usuarioRepository.findOne({where:{telefone: parametro}, relations:['usuarioPessoa', 'usuarioInstituicao']});

        if(!usuario){
          usuarioPessoa = await this.usuarioPessoaRepository.findOne({where:{cpf: parametro}, relations:['usuario']});
          if(usuarioPessoa)
            usuario = await this.usuarioRepository.findOne({where:{id: usuarioPessoa.idUsuario}, relations:['usuarioPessoa', 'usuarioInstituicao']});

          else{
            usuarioInstituicao = await this.usuarioInstituicaoRepository.findOne({where:{cnpj: parametro}, relations:['usuario']});

            if(usuarioInstituicao)
              usuario = await this.usuarioRepository.findOne({where:{id: usuarioInstituicao.idUsuario}, relations:['usuarioPessoa', 'usuarioInstituicao']});

            if(!usuario)
              return false
            else
              return usuario
          }

        }else
          return usuario
        
      }else
        return usuario
      
    }else
      return usuario
    
  }

  async buscarUsuario(parametro:any) {  
    try{
      let usuarioBuscado = await this.validaBuscaUsuario(parametro)
      
      if(usuarioBuscado)
        return usuarioBuscado;
      else
        throw new NotFoundException('Nenhum cadastro localizado.');

    }catch(erro){
      throw erro
    }
  }

  async alterarUsuario(idUsuario: number, novosDados: Partial<AtualizaUsuarioDTO>) {
    const usuarioEncontrado = await this.buscarUsuario(idUsuario);
    const novoObjeto: Record<string, any> = {};

    try{

      if(!usuarioEncontrado)
        throw new NotFoundException('Usuário não encontrado.');

      if(usuarioEncontrado.tipoUsuario === 'pessoa'){
        let usuarioPessoa = await this.usuarioPessoaRepository.findOneBy({id: usuarioEncontrado.usuarioPessoa.id});

        for(let itemUsuario in usuarioPessoa){
          
          for(let itemNovo in novosDados.especificacoes){
            
            if(itemUsuario === itemNovo){
              usuarioPessoa[itemUsuario] = novosDados.especificacoes[itemNovo];
            }
          }
        }
        const usuarioPessoaAtualizado = await this.usuarioPessoaRepository.save(usuarioPessoa);

        if(!usuarioPessoaAtualizado)
          throw new BadRequestException('Erro ao atualizar cadastro.');
      }
      else if(usuarioEncontrado.tipoUsuario === 'instituicao'){
        let usuarioInstituicao = await this.usuarioInstituicaoRepository.findOneBy({id: usuarioEncontrado.usuarioInstituicao.id});

        for(let itemUsuario in usuarioInstituicao){
          
          for(let itemNovo in novosDados.especificacoes){
            
            if(itemUsuario === itemNovo){
              usuarioInstituicao[itemUsuario] = novosDados.especificacoes[itemNovo];
            }
          }
        }
        const usuarioInstituicaoAtualizado = await this.usuarioPessoaRepository.save(usuarioInstituicao);

        if(!usuarioInstituicaoAtualizado)
          throw new BadRequestException('Erro ao atualizar cadastro.');
      }

      for (const chave in novosDados) {
        if (typeof novosDados[chave] !== 'object'){
            novoObjeto[chave] = novosDados[chave];
        }
      }

      Object.assign(usuarioEncontrado, novoObjeto);
      
      const usuarioAtualizado = await this.usuarioRepository.save(usuarioEncontrado);
          
      if(!usuarioAtualizado)
        throw new BadRequestException('Erro ao atualizar cadastro.');

      return {message: 'Cadastro atualizado.'};

    }catch(erro){
      throw erro
    }
  }

  async deletarUsuario(id: number) {
    const usuarioEncontrado:UsuarioEntity = await this.buscarUsuario(id);
    
    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.')

    try{
      if(await this.usuarioRepository.delete(usuarioEncontrado.id))
        return {message:'Usuário deletado.'};
      else{
        return {message:'Usuário nao deletado.'};
      }

    }catch(erro){
      throw new BadRequestException('Erro ao deletar cadastro.');
    }

  }

  async criarServico(idUsuario: number, servico:CriaServicoDto){
    const usuarioEncontrado:UsuarioEntity = await this.buscarUsuario(idUsuario);
    console.log(idUsuario)
    
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
      (servico)=> new ListaServicosDTO(servico.id, servico.titulo, servico.descricao, servico.dataServico, servico.status, 'servico.usuario.nome'));
     
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