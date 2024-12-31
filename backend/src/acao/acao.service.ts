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
  constructor(
    @InjectRepository(AcaoEntity) private readonly acaoRepository: Repository<AcaoEntity>,
    private readonly usuarioService: UsuarioService){}

  async criarAcao(idUsuario: number, acao:CriaAcaoDto){
    try{
      const usuarioEncontrado:UsuarioEntity = await this.usuarioService.buscarUsuario(idUsuario);
      const acaoEntity:AcaoEntity = new AcaoEntity();
    
      acaoEntity.tipoAcao = acao.tipoAcao;
      acaoEntity.titulo = acao.titulo;
      acaoEntity.status = acao.status;
      acaoEntity.dataInicial = acao.dataInicial;
      acaoEntity.dataFinal = acao.dataFinal;
      acaoEntity.descricao = acao.descricao;
      acaoEntity.usuario = usuarioEncontrado
   
      await this.acaoRepository.save(acaoEntity)
      
      return {statuscode:201, message: 'Sucesso ao cadastrar.'}
    
    }catch{
      throw new BadRequestException("Erro ao criar publicação.")
    }
  }

  async listarAcoes(){
    try{
      const listaAcao= await this.acaoRepository.find({relations:{usuario:true}})

      return listaAcao.map(
        (acao)=> new ListaAcaoDTO(
          acao.id,
          acao.tipoAcao,          
          acao.status, 
          acao.titulo, 
          acao.descricao, 
          acao.dataInicial, 
          acao.dataFinal,          
          acao.usuario.nome
        )
      );
    }catch{
      throw new BadRequestException("Erro ao buscar ações.")
    }
  }

  async buscarAcao(idAcao:number){
      const acaoEncontrada = await this.acaoRepository.findOneBy({id:idAcao});

      if(!acaoEncontrada)
        throw new NotFoundException('Nenhuma publicação encontrada.') 
    
      return acaoEncontrada
  }

  async buscaAcaoPorTexto(text: string){
    const acao = await this.acaoRepository
      .createQueryBuilder('acao')
      .select(['acao.id', 'acao.titulo', 'acao.descricao'])
      .where('lower(acao.titulo) like concat("%", lower(:text), "%")', {text})
      .getMany()

    console.log(acao)
  }

  async editarAcao(idUsuario: number, idAcao:number, novosDadosAcao: AtualizaAcaoDTO){
    const usuario = await this.usuarioService.buscarUsuario(idUsuario);
    let acaoEncontradaUsuario: AcaoEntity | null = null;

    try{
      const acaoEncontrada = await this.buscarAcao(idAcao);

      for(let acao of usuario.acoes){
        if(acao.id === acaoEncontrada.id)
          acaoEncontradaUsuario = acao
      }

      if(acaoEncontradaUsuario === null)  
        throw new BadRequestException;

      await this.acaoRepository.update(acaoEncontrada, novosDadosAcao)

      return {statuscode:200, message: 'Alteração feita com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao editar serviço.')
    }
  }

  async deletarAcao(idUsuario:number, idAcao:number){
    const usuarioEncontrado = await this.usuarioService.buscarUsuario(idUsuario);
    const acaoEncontrada = await this.buscarAcao(idAcao);

    if(!acaoEncontrada)
      throw new NotFoundException("Publicação não encontrada.")

    try{
      for(let acao of usuarioEncontrado.acoes){

        if(acao.id === idAcao)
          await this.acaoRepository.delete(acao)
      }

      return {statuscode:200, message:'Serviço excluído com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao excluir serviço.')
    }
  }
}
