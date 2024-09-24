import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoaEntity } from './entities/pessoa.entity';
import { ListaPessoaDTO } from './dto/usuario/pessoa/listaPessoa.dto';
import { CriaPessoaDTO } from './dto/usuario/pessoa/criaPessoa.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CriaAcaoDto } from '../acao/dto/criaAcao.dto';
import { AcaoEntity } from '../acao/entities/acao.entity';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { CriaInstituicaoDTO } from './dto/usuario/instituicao/criaInstituicao.dto';
import { ListaInstituicaoDTO } from './dto/usuario/instituicao/listaInstituicao.dto';
import { CriaUsuarioDTO } from './dto/usuario/criaUsuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { ListaUsuarioDTO } from './dto/usuario/listaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/usuario/atualizaUsuario.dto';
import { AtualizaAcaoDTO } from '../acao/dto/atualizaAcao.dto';

@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(UsuarioEntity) private readonly usuarioRepository: Repository<UsuarioEntity>,
              @InjectRepository(PessoaEntity) private readonly usuarioPessoaRepository: Repository<PessoaEntity>,
              @InjectRepository(InstituicaoEntity) private readonly usuarioInstituicaoRepository: Repository<InstituicaoEntity>){}

  validaPropriedades(object: any){
     if(typeof object === 'object'){

      for(let item in object){

        if(object[item]){

          if (object[item] === null || object[item] === undefined || object[item].trim?.() === "" || object[item].length < 3) 
            throw new BadRequestException(`A propriedade '${item}' não pode ser nula, indefinida, texto vazio ou ter menos de dois caracteres.`);

          else if(typeof object[item] === 'object')
            return this.validaPropriedades(object[item])

        }
        else
          throw new BadRequestException(`${item} é invalido`)
      }
    }
  }

  async criarUsuario(usuario: CriaUsuarioDTO, usuarioPessoa?: CriaPessoaDTO, usuarioInstituicao?: CriaInstituicaoDTO){
    const usuarioEntity= new UsuarioEntity();
    const usuarioPessoaEntity = new PessoaEntity();
    const usuarioInstituicaoEntity = new InstituicaoEntity();
    this.validaPropriedades(usuario)

    try{

      if(usuario.email && await this.validaBuscaUsuario(usuario.email)){
        throw new BadRequestException('Endereço de e-mail já cadastrado.')}

      if(await this.validaBuscaUsuario(usuario.telefone))
        throw new BadRequestException('Número de celular já cadastrado.')

      const senhaHasheada = await bcrypt.hash(usuario.senha, 10);

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

        if(!this.validarCNPJ(usuarioInstituicao.cnpj)) 
          throw new BadRequestException('CNPJ inválido.')
        

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
      throw new InternalServerErrorException('Erro interno, verifique as informações e tente novamente.')
    }
  }

  async listarUsuarios(opcao: number) {
    const usuarios = await this.usuarioRepository.find()
    const usuariosPessoas = await this.usuarioPessoaRepository.find();
    const usuariosInstituicoes = await this.usuarioInstituicaoRepository.find();

    if(!usuariosPessoas || !usuariosInstituicoes)
      throw new NotFoundException('Erro ao buscar usuários.')
 
    try{
      if(opcao === 1){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'pessoa'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.pedidosDeAjuda.length, 
              new ListaPessoaDTO(usuario.usuarioPessoa.id, usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao))
          }else if(usuario.tipoUsuario === 'instituicao'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.pedidosDeAjuda.length, 
              new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.areaAtuacao))
          }
        }) 
      }else if(opcao === 2){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'pessoa'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.pedidosDeAjuda.length,
              new ListaPessoaDTO(usuario.usuarioPessoa.id, usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao))
          }
        }) 
      }else if(opcao === 3){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'instituicao'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone,usuario.pedidosDeAjuda.length,
               new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.areaAtuacao))
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

    usuario = await this.usuarioRepository.findOneBy({id: parametro});
  
    if(!usuario){
      usuario = await this.usuarioRepository.findOne({where:{email: parametro}});

      if(!usuario){
        usuario = await this.usuarioRepository.findOne({where:{telefone: parametro}});

        if(!usuario){
          usuarioPessoa = await this.usuarioPessoaRepository.findOne({where:{cpf: parametro}});

          if(usuarioPessoa)
            usuario = await this.usuarioRepository.findOne({where:{id: usuarioPessoa.idUsuario}});

          else{
            usuarioInstituicao = await this.usuarioInstituicaoRepository.findOne({where:{cnpj: parametro}});

            if(usuarioInstituicao){
              usuario = await this.usuarioRepository.findOne({where:{id: usuarioInstituicao.idUsuario}});

              if(!usuario)
                return null
              else
                return usuario
            }
          }
        }
        else
          return usuario
      }
      else
        return usuario     
    }
    else
      return usuario        
  }

  async buscarUsuario(parametro:any) {  

      let usuarioBuscado = await this.validaBuscaUsuario(parametro)

      if(!(usuarioBuscado instanceof UsuarioEntity))
        throw new NotFoundException('Nenhum cadastro localizado.');
      
      return usuarioBuscado;
      
  }

  async alterarUsuario(idUsuario: number, novosDados: AtualizaUsuarioDTO) {
    const usuarioEncontrado = await this.buscarUsuario(idUsuario);
    this.validaPropriedades(novosDados);

    try{      
      if(!usuarioEncontrado)
        throw new NotFoundException('Usuário não encontrado.');

      if(usuarioEncontrado.tipoUsuario === 'pessoa'){
        let pessoa = usuarioEncontrado.usuarioPessoa;
        Object.assign(pessoa, novosDados.usuarioPessoa);
        const usuarioPessoatualizado = await this.usuarioPessoaRepository.save(pessoa);

        if(!usuarioPessoatualizado)
          throw new BadRequestException('Erro ao atualizar cadastro.');
      }
      
      else if(usuarioEncontrado.tipoUsuario === 'instituicao'){
        let instituicao = usuarioEncontrado.usuarioInstituicao;
        Object.assign(instituicao, novosDados.usuarioInstituicao)
        const usuarioInstituicaotualizado = await this.usuarioInstituicaoRepository.save(instituicao);

        if(!usuarioInstituicaotualizado)
          throw new BadRequestException('Erro ao atualizar cadastro.');
      }

      Object.assign(usuarioEncontrado, novosDados);
      const usuarioAtualizado = await this.usuarioRepository.save(usuarioEncontrado);

      if(!usuarioAtualizado)
        throw new BadRequestException('Erro ao atualizar cadastro.');
      else
        return {statusCode:200, message:'Atualizado com sucesso.'}

    }catch{
      throw new InternalServerErrorException('Erro interno, verifique as informações e tente novamente.')
    }
  }

  async deletarUsuario(id: number) {
    const usuarioEncontrado:UsuarioEntity = await this.buscarUsuario(id);
    try{
      if(!usuarioEncontrado)
        throw new NotFoundException('Usuário não encontrado.')

      const usuarioDeletado = await this.usuarioRepository.remove(usuarioEncontrado)

      if(!usuarioDeletado)
        throw new BadRequestException('Erro ao excluir cadastro.')
      else
        return{message:'Usuário excluido com sucesso.'}

    }catch(erro){
      throw erro;
    }
  }

  validarCPF(cpf: string){
    let cpfLista = cpf.split('');
    let cpfnumero = [];
    let cpfVerifica = [];
    let soma:number = 0;
    let segundaSoma:number = 0;
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

  validarCNPJ(cnpj: string){
    let cnpjLista = cnpj.split('')
    let cnpjNumero = [];
    let cnpjVerifica = [];
    const primeiraListaApoio = [ 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const segundaListaApoio = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let primeiraSoma = 0;
    let segundaSoma = 0;
    let primeiroDigitoVerificadorCNPJ:number;
    let segundoDigitoVerificadorCNPJ:number;
    let verificador:boolean = false;

    for(let i = 0; i < cnpjLista.length; i++){
      cnpjVerifica[i] = parseInt(cnpjLista[i]);
    }

    for(let i = 0; i < (cnpjLista.length - 2); i++){
      cnpjNumero[i] = parseInt(cnpjLista[i])
      primeiraListaApoio[i] *= cnpjNumero[i]
      primeiraSoma += primeiraListaApoio[i]
    }    

    if(primeiraSoma % 11 < 2){
      primeiroDigitoVerificadorCNPJ = 0
    }else{
      primeiroDigitoVerificadorCNPJ = 11 - (primeiraSoma % 11)
    }

    cnpjNumero.push(primeiroDigitoVerificadorCNPJ)

    for(let i = 0; i < (cnpjLista.length - 1); i++){
      segundaListaApoio[i] *= cnpjNumero[i] 
      segundaSoma += segundaListaApoio[i]
    }   

    if(segundaSoma % 11 < 2){
      segundoDigitoVerificadorCNPJ = 0
    }else{
      segundoDigitoVerificadorCNPJ = 11 - (segundaSoma % 11)
    }

    cnpjNumero.push(segundoDigitoVerificadorCNPJ)

    for(let i = 0; i < cnpjNumero.length; i++){
      
      if(cnpjNumero[i] == cnpjVerifica[i]){
        verificador = true
      }
      else{
        verificador = false
      }
    }

    return verificador
  }
}
