import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriaAcaoDto } from './dto/criaAcao.dto';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { AcaoEntity } from './entities/acao.entity';
import { AtualizaAcaoDTO } from './dto/atualizaAcao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ListaAcaoDTO } from './dto/listaAcao.dto';

@Injectable()
export class AcaoService {
  constructor(@InjectRepository(AcaoEntity) private readonly acaoRepository: Repository<AcaoEntity>,
              private readonly usuarioService: UsuarioService){}

  async criarAcao(idUsuario: number, acao:CriaAcaoDto){
    const usuarioEncontrado:UsuarioEntity = await this.usuarioService.buscarUsuario(idUsuario);
    
    if(!usuarioEncontrado)
      throw new NotFoundException('Usuário não encontrado.');

    const acaoEntity = new AcaoEntity();
    
    acaoEntity.tipoAcao = acao.tipoAcao;
    acaoEntity.titulo = acao.titulo;
    acaoEntity.status = acao.status;
    acaoEntity.dataInicial = acao.dataInicial;
    acaoEntity.dataFinal = acao.dataFinal;
    acaoEntity.descricao = acao.descricao;
    acaoEntity.usuarioResponsavel = usuarioEncontrado
    
    await this.acaoRepository.save(acaoEntity)

    return {message: 'Sucesso ao cadastrar.'}
  
  }

  async listarAcoes(){
    const listaAcao= await this.acaoRepository.find({relations:{usuarioResponsavel:true}})
    const acoes = listaAcao.map( 
      (acao)=> new ListaAcaoDTO(acao.id, acao.titulo, acao.tipoAcao, acao.status, acao.dataInicial, acao.dataFinal, acao.descricao, acao.usuarioResponsavel.nome));
     
    return acoes;
  }

  async buscarAcao(idAcao:number){
    try{
      let acaoEncontrada = await this.acaoRepository.findOneBy({id:idAcao});

      if(!acaoEncontrada)
        throw new NotFoundException('Nenhuma solicitação de serviço encontrada.') 
    
      return acaoEncontrada
      
    }catch(erro){
      throw erro
    }
  }

  async editarAcao(idUsuario: number, idAcao:number, novosDadosAcao: AtualizaAcaoDTO){
    const usuarioEncontrado = await  this.usuarioService.buscarUsuario(idUsuario);
    const AcaoEncontrada = await this.buscarAcao(idAcao);

    try{
      if(!usuarioEncontrado)
        throw new NotFoundException('Usuario inválido.');

      const novaAcao = await this.acaoRepository.update(AcaoEncontrada, novosDadosAcao)

      if(!novaAcao)
        throw new BadRequestException('Erro ao editar serviço.')
      
      return {message: 'Alteração feita com sucesso.'}

    }catch(erro){
      throw erro
    }
  }

  async deletarAcao(idUsuario:number, idAcao:number){
    const usuarioEncontrado = await this.usuarioService.buscarUsuario(idUsuario);
    const acaoEncontrada = await this.buscarAcao(idAcao);
    let acaoExcluido: any;

    try{
      for(let acao of usuarioEncontrado.pedidosDeAjuda){

        if(acao.id === idAcao)
          acaoExcluido = await this.acaoRepository.delete(acao)
      }

      if(acaoExcluido)
        return {message:'Serviço excluído com sucesso.'}
      else
        throw new BadRequestException('Erro ao excluir serviço.')

    }catch(erro){
      throw erro
    }
  }
}
