import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoaEntity } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { UsuarioEntity } from './entities/usuario.entity';
import { CriaUsuarioDTO } from './dto/criaUsuario.dto';
import { TipoUsuarioEnum } from './enum/tipoUsuario.enum';
import { ListaUsuarioDTO } from './dto/listaUsuario.dto';
import { ListaPessoaDTO } from './dto/pessoa/listaPessoa.dto';
import { ListaInstituicaoDTO } from './dto/instituicao/listaInstituicao.dto';
import { AtualizaUsuarioDTO } from './dto/atualizaUsuario.dto';
import { AlteraSenhaDTO } from './dto/alteraSenha.dto';
import { PublicacaoService } from '../publicacao/publicacao.service';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity) private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(PessoaEntity) private readonly usuarioPessoaRepository: Repository<PessoaEntity>,
    @InjectRepository(InstituicaoEntity) private readonly usuarioInstituicaoRepository: Repository<InstituicaoEntity>,
    @Inject(forwardRef(() => PublicacaoService)) private readonly publicacaoService: PublicacaoService
  ){}

  async criar(usuario: CriaUsuarioDTO){
    this.validaPropriedades(usuario)
    try{
      const usuarioEntity:UsuarioEntity = new UsuarioEntity();

      if(await this.buscarEValidar(usuario.telefone))
        throw new BadRequestException('Número de telefone já cadastrado.')
      
      if(usuario.email && await this.buscarEValidar(usuario.email))
        throw new BadRequestException('E-mail já cadastrado.')

      if(usuario.senha != usuario.confirmaSenha)
        throw new BadRequestException('As senhas não conferem.')

      const senhaHasheada: string = await bcrypt.hash(usuario.senha, 10);
     
      usuarioEntity.tipoUsuario = usuario.tipoUsuario,
      usuarioEntity.nome = usuario.nome;
      usuarioEntity.email = usuario.email;
      usuarioEntity.telefone = usuario.telefone;
      usuarioEntity.senha = senhaHasheada;

      if(usuario.tipoUsuario == TipoUsuarioEnum.PESSOA && usuario.pessoa){
        const usuarioPessoaEntity: PessoaEntity = new PessoaEntity();
        
        this.validaPropriedades(usuario.pessoa)

        if(!this.validarCPF(usuario.pessoa.cpf))
          throw new BadRequestException('CPF inválido.')

        if(await this.buscarEValidar(usuario.pessoa.cpf))
          throw new BadRequestException('CPF já cadastrado.')

        const usuarioCriado: UsuarioEntity = await this.usuarioRepository.save(usuarioEntity);

        usuarioPessoaEntity.idUsuario = usuarioCriado.id;
        usuarioPessoaEntity.cpf = usuario.pessoa.cpf;
        usuarioPessoaEntity.dataNascimento = usuario.pessoa.dataNascimento;
        usuarioPessoaEntity.genero = usuario.pessoa.genero;
        usuarioPessoaEntity.situacao = usuario.pessoa.situacao;

        const usuarioPessoaCriado = await this.usuarioPessoaRepository.save(usuarioPessoaEntity);    

        if(usuarioPessoaCriado){
          usuarioCriado.usuarioPessoa = usuarioPessoaCriado;

          await this.usuarioRepository.save(usuarioCriado);

          return{statusCode: 201, message: 'Usuário cadastrado com sucesso.'};
              
        }else
          throw new BadRequestException('Erro ao cadastrar, verifique as informações e tente novamente.')
      }    
      else if(usuario.tipoUsuario === TipoUsuarioEnum.INSTITUICAO && usuario.instituicao){
        const usuarioInstituicaoEntity:InstituicaoEntity = new InstituicaoEntity();
        
        this.validaPropriedades(usuario.instituicao)

        if(!this.validarCNPJ(usuario.instituicao.cnpj)) 
          throw new BadRequestException('CNPJ inválido.')
        
        if(await this.buscarEValidar(usuario.instituicao.cnpj))
          throw new BadRequestException('CNPJ já cadastrado.')

        const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);

        usuarioInstituicaoEntity.idUsuario = usuarioEntity.id;
        usuarioInstituicaoEntity.cnpj = usuario.instituicao.cnpj;
        usuarioInstituicaoEntity.dataFundacao = usuario.instituicao.dataFundacao;
        usuarioInstituicaoEntity.segmento = usuario.instituicao.segmento;

        const usuarioInstituicaoCriado = await this.usuarioInstituicaoRepository.save(usuarioInstituicaoEntity);

        if(usuarioInstituicaoCriado){
          usuarioCriado.usuarioInstituicao = usuarioInstituicaoEntity;

          await this.usuarioRepository.save(usuarioCriado);

          return{statusCode: 201, message: 'Usuário cadastrado com sucesso.'};

        }else
          throw new BadRequestException('Erro ao cadastrar.')

      }else
          throw new BadRequestException('Tipo do usuário inválido.')     
    }catch(erro){

      if(erro instanceof BadRequestException)
        throw erro;
      
      throw new InternalServerErrorException('Erro interno. Tente novamente.')
    } 
  }

  async listar(opcao: number) {
    try{
      const usuarios: UsuarioEntity[] = await this.usuarioRepository.find()
      const usuariosPessoas: PessoaEntity[] = await this.usuarioPessoaRepository.find();
      const usuariosInstituicoes: InstituicaoEntity[] = await this.usuarioInstituicaoRepository.find();

      if(usuarios.length < 0 || usuariosPessoas.length < 0 || usuariosInstituicoes.length < 0)
        throw new NotFoundException('Nenhum registro encontrado.')
  
  
        if(opcao === 1){
          return usuarios.map((usuario) => {
            if(usuario.tipoUsuario === TipoUsuarioEnum.PESSOA){
              return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.publicacoes.length, 
                new ListaPessoaDTO(usuario.usuarioPessoa.id, usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao))
            }else if(usuario.tipoUsuario === TipoUsuarioEnum.INSTITUICAO){
              return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.publicacoes.length, 
                new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.segmento))
            }
          }) 
        }else if(opcao === 2){
          return usuarios.map((usuario) => {
            if(usuario.tipoUsuario === TipoUsuarioEnum.PESSOA){
              return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.publicacoes.length,
                new ListaPessoaDTO(usuario.usuarioPessoa.id, usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao))
            }
          }) 
        }else if(opcao === 3){
          return usuarios.map((usuario) => {
            if(usuario.tipoUsuario === TipoUsuarioEnum.INSTITUICAO){
              return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone,usuario.publicacoes.length,
                new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.segmento))
            }
          }) 
        }
      }
    catch(erro){

      if(erro instanceof NotFoundException)
        throw erro

      throw new InternalServerErrorException('Erro ao buscar usuários.')
    }
  }

  async buscarEValidar(parametro: any){
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
          
          if(usuarioPessoa){
            usuario = await this.usuarioRepository.findOne({where:{id: usuarioPessoa.idUsuario}});
            return usuario;
          }
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

  async buscar(parametro:any){
    try{
      const usuarioBuscado: UsuarioEntity = await this.buscarEValidar(parametro);

      if(!(usuarioBuscado instanceof UsuarioEntity))
        throw new NotFoundException('Nenhum cadastro localizado.');
    
      return usuarioBuscado; 

    }catch(erro){

      if(erro instanceof NotFoundException)
        throw erro;

      throw new InternalServerErrorException('Não foi possível buscar usuário.');
    }
  }

  async buscarUsuarioFormatado(parametro:any){
      const usuarioBuscado: UsuarioEntity = await this.buscar(parametro);
      let especificacao: ListaPessoaDTO | ListaInstituicaoDTO;

      if(usuarioBuscado.usuarioPessoa){
        especificacao = new ListaPessoaDTO(
        usuarioBuscado.usuarioPessoa.id, usuarioBuscado.usuarioPessoa.dataNascimento, usuarioBuscado.usuarioPessoa.genero, usuarioBuscado.usuarioPessoa.situacao)
      }else if(usuarioBuscado.usuarioInstituicao){
        especificacao = new ListaInstituicaoDTO(
        usuarioBuscado.usuarioPessoa.id, usuarioBuscado.usuarioInstituicao.cnpj, usuarioBuscado.usuarioInstituicao.dataFundacao, usuarioBuscado.usuarioInstituicao.segmento)
      }

      return new ListaUsuarioDTO(
        usuarioBuscado.id, usuarioBuscado.tipoUsuario, usuarioBuscado.nome, usuarioBuscado.email, usuarioBuscado.telefone, usuarioBuscado.publicacoes.length, especificacao
      ); 
  }

  async alterar(idUsuario: number, novosDados: AtualizaUsuarioDTO) {
    this.validaPropriedades(novosDados);

    try{ 
      const usuarioEncontrado = await this.buscar(idUsuario);

      if(!usuarioEncontrado)
        throw new NotFoundException('Erro ao relacionar usuário.');

      Object.assign(usuarioEncontrado, novosDados)

      // await this.usuarioRepository.update({id:usuarioEncontrado.id}, {
      //   nome: novosDados.nome,
      //   email: novosDados.email,
      //   telefone: novosDados.telefone
      // })     

      // if(usuarioEncontrado.tipoUsuario === TipoUsuarioEnum.PESSOA){
      //   await this.usuarioPessoaRepository.update({id: usuarioEncontrado.usuarioPessoa.id}, {
      //     dataNascimento: novosDados.pessoa.dataNascimento,
      //     genero: novosDados.pessoa.genero,
      //     situacao: novosDados.pessoa.situacao
      //   })
      // }
      // else if(usuarioEncontrado.tipoUsuario === TipoUsuarioEnum.INSTITUICAO){
      //   await this.usuarioInstituicaoRepository.update({id: usuarioEncontrado.usuarioPessoa.id}, {
      //     dataFundacao: novosDados.instituicao.dataFundacao,
      //     segmento: novosDados.instituicao.segmento
      //   }) 
      // }
      // else
      //   throw new NotFoundException('Erro ao relacionar cadastro.');
      
      return {statusCode:200, message:'Atualizado com sucesso.'}

    }catch(erro){

      if(erro instanceof NotFoundException)
        throw erro
      console.log(erro)
      throw new InternalServerErrorException('Erro ao atualizar cadastro. Tente novamente.');
    }
  }

  async alterarSenha(idUsuario: number, senha: AlteraSenhaDTO){
    try{
      const usuarioEncontrado: UsuarioEntity = await this.buscar(idUsuario);

      if(!usuarioEncontrado)
        throw new NotFoundException('Erro ao relacionar usuário.');

      if(senha.senhaAtual != usuarioEncontrado.senha)
        throw new BadRequestException('A senha atual não confere.');

      if(senha.senhaAtual != senha.confirmaSenhaNova)
        throw new BadRequestException('A confirmação da senha não confere.');

    }catch(erro){

      if(erro instanceof NotFoundException || erro instanceof BadRequestException)
        throw erro;

      throw new InternalServerErrorException('Erro ao atualizar senha. Tente novamente.')
    }
  }

  async deletar(id: number){
    try{
      const usuarioEncontrado:UsuarioEntity = await this.buscar(id);
      /*let publicacaoEncontrada: PublicacaoEntity | null = null;

      if(usuarioEncontrado.publicacoes.length > 0){
        for(let publicacao of usuarioEncontrado.publicacoes){
          publicacaoEncontrada = publicacao
        };
      }

      await this.publicacaoService.deletar(usuarioEncontrado.id, publicacaoEncontrada.id);*/
      await this.usuarioRepository.delete(usuarioEncontrado.id);

      /*if (usuarioEncontrado.usuarioPessoa) {
        await this.usuarioPessoaRepository.delete({id:usuarioEncontrado.usuarioPessoa.id});
      }
      else if (usuarioEncontrado.usuarioInstituicao) {
        await this.usuarioPessoaRepository.delete({id:usuarioEncontrado.usuarioInstituicao.id});
      }
      else  
        throw new BadRequestException('Erro ao excluir cadastro. Tente novamente.')*/
     
      return{statusCode:200, message:'Cadastro excluido com sucesso.'}

    }catch(erro){

      if(erro instanceof NotFoundException || erro instanceof BadRequestException)
        throw erro
      
      throw new InternalServerErrorException('Erro interno. Tente novamente.')
    }    
  }

  validaPropriedades(param: any){
    if (param == null || param === undefined || param.trim?.() === '' || param.length < 3) 
      throw new BadRequestException(`Valor inválido. ${param}`);
    
    else if (typeof param === 'object'){

      for (let item in param){

        if (param[item]) return this.validaPropriedades(param[item])

        else throw new BadRequestException(`${item} é invalido.`)
      }
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
    let primeiraSoma = 0;
    let segundaSoma = 0;
    let primeiroDigitoVerificadorCNPJ:number;
    let segundoDigitoVerificadorCNPJ:number;
    let verificador:boolean = false;
    const primeiraListaApoio = [ 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const segundaListaApoio = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

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