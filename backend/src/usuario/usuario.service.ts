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
              @InjectRepository(InstituicaoEntity) private readonly usuarioInstituicaoRepository: Repository<InstituicaoEntity>,
              @InjectRepository(AcaoEntity) private readonly acaoRepository: Repository<AcaoEntity>){}

  validaPropriedades(object: any){
    if(typeof object === 'object'){

      for(let item in object){

        if(object[item]){

          if (object[item] === null || object[item] === undefined || object[item].trim?.() === '' || object[item].length < 3) 
            throw new BadRequestException(`A propriedade '${item}' não pode ser nula, indefinida, texto vazio ou ter menos de três caracteres.`);

          else if(typeof object[item] === 'object')
            return this.validaPropriedades(object[item])

        }
        else
          throw new BadRequestException(`${item} é invalido.`)
      }
    }
  }

  async criarUsuario(usuario: CriaUsuarioDTO, usuarioPessoa?: CriaPessoaDTO, usuarioInstituicao?: CriaInstituicaoDTO){
    const usuarioEntity= new UsuarioEntity();
    const usuarioPessoaEntity = new PessoaEntity();
    const usuarioInstituicaoEntity = new InstituicaoEntity();
    
    this.validaPropriedades(usuario)

    if(usuario.email && await this.validaBuscaUsuario(usuario.email)){
      throw new BadRequestException('Endereço de e-mail já cadastrado.')}

    if(await this.validaBuscaUsuario(usuario.telefone))
      throw new BadRequestException('Número de telefone já cadastrado.')

    const senhaHasheada = await bcrypt.hash(usuario.senha, 10);

    usuarioEntity.tipoUsuario = usuario.tipoUsuario,
    usuarioEntity.nome = usuario.nome;
    usuarioEntity.email = usuario.email;
    usuarioEntity.telefone = usuario.telefone;
    usuarioEntity.senha = senhaHasheada;

    if(usuarioPessoa != null){
      this.validaPropriedades(usuarioPessoa)

      if(!this.validarCPF(usuarioPessoa.cpf))
        throw new BadRequestException('CPF inválido.')

      if(await this.validaBuscaUsuario(usuarioPessoa.cpf))
        throw new BadRequestException('CPF já cadastrado.')

      const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);
      const dataFormatada = this.formataData(usuarioPessoa.dataNascimento)

      usuarioPessoaEntity.idUsuario = usuarioCriado.id;
      usuarioPessoaEntity.cpf = usuarioPessoa.cpf;
      usuarioPessoaEntity.dataNascimento = dataFormatada;
      usuarioPessoaEntity.genero = usuarioPessoa.genero;
      usuarioPessoaEntity.situacao = usuarioPessoa.situacao;

      const usuarioPessoaCriado = await this.usuarioPessoaRepository.save(usuarioPessoaEntity);    

      if(usuarioPessoaCriado){
        usuarioCriado.usuarioPessoa = usuarioPessoaCriado;

        await this.usuarioRepository.save(usuarioCriado);

        return{statusCode: 201, message: 'Usuário cadastrado com sucesso.'};
        
      }else
        throw new BadRequestException('Erro ao cadastrar.')
    }    
    else if(usuarioInstituicao != null){
      this.validaPropriedades(usuarioInstituicao)

      if(!this.validarCNPJ(usuarioInstituicao.cnpj)) 
        throw new BadRequestException('CNPJ inválido.')
      
      if(await this.validaBuscaUsuario(usuarioInstituicao.cnpj))
        throw new BadRequestException('CNPJ já cadastrado.')

      const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);
      const dataFormatada = this.formataData(usuarioInstituicao.dataFundacao)

      usuarioInstituicaoEntity.idUsuario = usuarioEntity.id;
      usuarioInstituicaoEntity.cnpj = usuarioInstituicao.cnpj;
      usuarioInstituicaoEntity.dataFundacao = dataFormatada;
      usuarioInstituicaoEntity.areaAtuacao = usuarioInstituicao.areaAtuacao;

      const usuarioInstituicaoCriado = await this.usuarioInstituicaoRepository.save(usuarioInstituicaoEntity);

      if(usuarioInstituicaoCriado){
        usuarioCriado.usuarioInstituicao = usuarioInstituicaoEntity;

        await this.usuarioRepository.save(usuarioCriado);

        return{statusCode: 201, message: 'Usuário cadastrado com sucesso.'};

      }else
        throw new BadRequestException('Erro ao cadastrar.')

    }else
        throw new BadRequestException('Tipo do usuário inválido.')      
  }

  async listarUsuarios(opcao: number) {
    const usuarios = await this.usuarioRepository.find()
    const usuariosPessoas = await this.usuarioPessoaRepository.find();
    const usuariosInstituicoes = await this.usuarioInstituicaoRepository.find();

    if(usuarios.length < 0 || usuariosPessoas.length < 0 || usuariosInstituicoes.length < 0)
      throw new BadRequestException('Não foi possível realizar a busca.')
 
    try{
      if(opcao === 1){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'pessoa'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.acoes.length, 
              new ListaPessoaDTO(usuario.usuarioPessoa.id, usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao))
          }else if(usuario.tipoUsuario === 'instituicao'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.acoes.length, 
              new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.areaAtuacao))
          }
        }) 
      }else if(opcao === 2){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'pessoa'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone, usuario.acoes.length,
              new ListaPessoaDTO(usuario.usuarioPessoa.id, usuario.usuarioPessoa.dataNascimento, usuario.usuarioPessoa.genero, usuario.usuarioPessoa.situacao))
          }
        }) 
      }else if(opcao === 3){
        return usuarios.map((usuario) => {
          if(usuario.tipoUsuario === 'instituicao'){
            return new ListaUsuarioDTO(usuario.id, usuario.tipoUsuario, usuario.nome, usuario.email, usuario.telefone,usuario.acoes.length,
               new ListaInstituicaoDTO(usuario.usuarioInstituicao.id, usuario.usuarioInstituicao.cnpj, usuario.usuarioInstituicao.dataFundacao, usuario.usuarioInstituicao.areaAtuacao))
          }
        }) 
      }
    }
    catch{
      throw new BadRequestException('Erro ao buscar usuários.')
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
          
          if(usuarioPessoa){
            usuario = await this.usuarioRepository.findOne({where:{id: usuarioPessoa.idUsuario}});
            return usuario
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

  async buscarUsuario(parametro:any){
    const usuarioBuscado = await this.validaBuscaUsuario(parametro)

    if(!(usuarioBuscado instanceof UsuarioEntity))
      throw new NotFoundException('Nenhum cadastro localizado.');
    
    return usuarioBuscado;  
  }

  async alterarUsuario(idUsuario: number, novosDados: AtualizaUsuarioDTO) {
    const usuarioEncontrado = await this.buscarUsuario(idUsuario);
    this.validaPropriedades(novosDados);

    try{ 
      await this.usuarioRepository.update({id:usuarioEncontrado.id}, {
        nome: novosDados.nome,
        email: novosDados.email,
        telefone: novosDados.telefone
      })     

      if(usuarioEncontrado.tipoUsuario === 'pessoa'){
        await this.usuarioPessoaRepository.update({id: usuarioEncontrado.usuarioPessoa.id}, {
          dataNascimento: novosDados.usuarioPessoa.dataNascimento,
          genero: novosDados.usuarioPessoa.genero,
          situacao: novosDados.usuarioPessoa.situacao
        })
      }
      else if(usuarioEncontrado.tipoUsuario === 'instituicao'){
        await this.usuarioInstituicaoRepository.update({id: usuarioEncontrado.usuarioPessoa.id}, {
          dataFundacao: novosDados.usuarioInstituicao.dataFundacao,
          areaAtuacao: novosDados.usuarioInstituicao.areaAtuacao
        })
      }
      return {statusCode:200, message:'Atualizado com sucesso.'}

    }catch(e){
      console.log(e)
      throw new BadRequestException('Erro ao atualizar cadastro.');
    }
  }

  async deletarUsuario(id: number){
    const usuarioEncontrado:UsuarioEntity = await this.buscarUsuario(id);

    try{
      if(usuarioEncontrado.acoes.length > 0){
        for(let acao of usuarioEncontrado.acoes){
          await this.acaoRepository.delete(acao)
        }
      }
      await this.usuarioRepository.delete(usuarioEncontrado.id)

      if (usuarioEncontrado.usuarioPessoa) {
        await this.usuarioPessoaRepository.delete({id:usuarioEncontrado.usuarioPessoa.id});
      }
     
      return{statusCode:200, message:'Usuário excluido com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao excluir cadastro.')
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

  formataData(data: string){
    try{
      const [dia, mes, ano] = data.split('/');
      const novaData = new Date(Number(ano), Number(mes) - 1, Number(dia));
      const dataFormatada = novaData.toISOString().split('T')[0];

      return dataFormatada
    }
    catch(erro){
      throw new BadRequestException('Verifique o formato da data.')
    }
  }
}