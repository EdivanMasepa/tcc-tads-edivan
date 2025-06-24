import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoaEntity } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InstituicaoEntity } from './entities/instituicao.entity';
import { UsuarioEntity } from './entities/usuario.entity';
import { PublicacaoEntity } from '../publicacao/entities/publicacao.entity';
import { CriaUsuarioDTO } from './dto/criaUsuario.dto';
import { TipoUsuarioEnum } from './enum/tipoUsuario.enum';
import { ListaUsuarioDTO } from './dto/listaUsuario.dto';
import { ListaPessoaDTO } from './dto/pessoa/listaPessoa.dto';
import { ListaInstituicaoDTO } from './dto/instituicao/listaInstituicao.dto';
import { AtualizaUsuarioDTO } from './dto/atualizaUsuario.dto';


@Injectable()
export class UsuarioService {
  constructor(@InjectRepository(UsuarioEntity) private readonly usuarioRepository: Repository<UsuarioEntity>,
              @InjectRepository(PessoaEntity) private readonly usuarioPessoaRepository: Repository<PessoaEntity>,
              @InjectRepository(InstituicaoEntity) private readonly usuarioInstituicaoRepository: Repository<InstituicaoEntity>,
              @InjectRepository(PublicacaoEntity) private readonly acaoRepository: Repository<PublicacaoEntity>){}

  async criar(usuario: CriaUsuarioDTO){
    const usuarioEntity:UsuarioEntity = new UsuarioEntity();
    //this.validaPropriedades(usuario)
    //console.log(usuario)
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

    if(usuario.tipoUsuario == TipoUsuarioEnum.PESSOA ){
      const usuarioPessoaEntity: PessoaEntity = new PessoaEntity();
      //this.validaPropriedades(usuario.pessoa)
      console.log(usuario)
      if(!this.validarCPF(usuario.pessoa?.cpf))
        throw new BadRequestException('CPF inválido.')

      if(await this.buscarEValidar(usuario.pessoa.cpf))
        throw new BadRequestException('CPF já cadastrado.')

      const usuarioCriado: UsuarioEntity = await this.usuarioRepository.save(usuarioEntity);
      //const dataFormatada: string = this.formataData(usuario.pessoa.dataNascimento, usuario.tipoUsuario)

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
    else if(usuario.tipoUsuario === TipoUsuarioEnum.INSTITUICAO && usuario.instituicao != null){
      const usuarioInstituicaoEntity:InstituicaoEntity = new InstituicaoEntity();
      this.validaPropriedades(usuario.instituicao)

      if(!this.validarCNPJ(usuario.instituicao.cnpj)) 
        throw new BadRequestException('CNPJ inválido.')
      
      if(await this.buscarEValidar(usuario.instituicao.cnpj))
        throw new BadRequestException('CNPJ já cadastrado.')

      const usuarioCriado = await this.usuarioRepository.save(usuarioEntity);
      //const dataFormatada = this.formataData(usuario.instituicao.dataFundacao, usuario.tipoUsuario)

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
  }

  async listar(opcao: number) {
    const usuarios: UsuarioEntity[] = await this.usuarioRepository.find()
    const usuariosPessoas: PessoaEntity[] = await this.usuarioPessoaRepository.find();
    const usuariosInstituicoes: InstituicaoEntity[] = await this.usuarioInstituicaoRepository.find();

    if(usuarios.length < 0 || usuariosPessoas.length < 0 || usuariosInstituicoes.length < 0)
      throw new NotFoundException('Nenhum registro encontrado.')
 
    try{
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
    catch{
      throw new BadRequestException('Erro ao buscar usuários.')
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
    const usuarioBuscado: UsuarioEntity = await this.buscarEValidar(parametro)

    if(!(usuarioBuscado instanceof UsuarioEntity))
      throw new NotFoundException('Nenhum cadastro localizado.');
    
    return usuarioBuscado;  
  }

  async alterar(idUsuario: number, novosDados: AtualizaUsuarioDTO) {
    const usuarioEncontrado = await this.buscar(idUsuario);
    this.validaPropriedades(novosDados);

    try{ 
      await this.usuarioRepository.update({id:usuarioEncontrado.id}, {
        nome: novosDados.nome,
        email: novosDados.email,
        telefone: novosDados.telefone
      })     

      if(usuarioEncontrado.tipoUsuario === TipoUsuarioEnum.PESSOA){
        await this.usuarioPessoaRepository.update({id: usuarioEncontrado.usuarioPessoa.id}, {
          dataNascimento: novosDados.usuarioPessoa.dataNascimento,
          genero: novosDados.usuarioPessoa.genero,
          situacao: novosDados.usuarioPessoa.situacao
        })
      }
      else if(usuarioEncontrado.tipoUsuario === TipoUsuarioEnum.INSTITUICAO){
        await this.usuarioInstituicaoRepository.update({id: usuarioEncontrado.usuarioPessoa.id}, {
          dataFundacao: novosDados.usuarioInstituicao.dataFundacao,
          segmento: novosDados.usuarioInstituicao.segmento
        })
      }
      return {statusCode:200, message:'Atualizado com sucesso.'}

    }catch(e){
      console.log(e)
      throw new BadRequestException('Erro ao atualizar cadastro.');
    }
  }

  async deletar(id: number){
    const usuarioEncontrado:UsuarioEntity = await this.buscar(id);

    try{
      if(usuarioEncontrado.publicacoes.length > 0){
        for(let acao of usuarioEncontrado.publicacoes){
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

  validaPropriedades(param: any){
    if (param === null || param === undefined || param.trim?.() === '' || param.length < 3) 
      throw new BadRequestException(`A propriedade '${param}' não possui um valor válido.`);
    
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

  // validaData(data: string, tipoUsuario: TipoUsuario){
  //   const dataAtual: Date = new Date();
  //   const dataMinima: Date = new Date();
  //   const dataMaxima: Date = new Date();

  //   try{
      
  //     if(tipoUsuario == TipoUsuario.PESSOA){
  //       dataMinima.setFullYear(dataAtual.getFullYear() - 5);
  //       dataMaxima.setFullYear(dataAtual.getFullYear() - 100)
  //     }
      
  //     const [dia, mes, ano] = data.split('/');
  //     const novaData = new Date(Number(ano), Number(mes) - 1, Number(dia));
  //     const dataFormatada = novaData.toISOString().split('T')[0];
      
  //     if (novaData > dataMinima || novaData < dataMinima)
  //       throw new BadRequestException(  )

  //     return dataFormatada
  //   }
  //   catch(erro){
  //     console.log(erro)
  //     throw new BadRequestException('Data tem valor inválido.')
  //   }
  // }

  // formataData(data: string){
  //   try{
  //     const [dia, mes, ano] = data.split('/');
  //     const novaData = new Date(Number(ano), Number(mes) - 1, Number(dia));
  //     const dataFormatada = novaData.toISOString().split('T')[0];

  //     return dataFormatada
  //   }
  //   catch(erro){
  //     return null
  //   }
  // }

}