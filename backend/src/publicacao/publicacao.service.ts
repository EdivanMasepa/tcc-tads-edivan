import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriaPublicacaoDto } from './dto/criaPublicacao.dto';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { PublicacaoEntity } from './entities/publicacao.entity';
import { AtualizaPublicacaoDTO } from './dto/atualizaPublicacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ListaPublicacaoDTO } from './dto/listaPublicacao.dto';

@Injectable()
export class PublicacaoService {
  constructor(
    @InjectRepository(PublicacaoEntity) private readonly publicacaoRepository: Repository<PublicacaoEntity>,
    private readonly usuarioService: UsuarioService){}

  async criarPublicacao(idUsuario: number, publicacao:CriaPublicacaoDto){
    try{
      const usuarioEncontrado:UsuarioEntity = await this.usuarioService.buscarUsuario(idUsuario);
      const publicacaoEntity:PublicacaoEntity = new PublicacaoEntity();
    
      publicacaoEntity.categoria = publicacao.categoria;
      publicacaoEntity.titulo = publicacao.titulo;
      publicacaoEntity.descricao = publicacao.descricao;
      publicacaoEntity.data = publicacao.data;
      publicacaoEntity.usuario = usuarioEncontrado
   
      await this.publicacaoRepository.save(publicacaoEntity)
      
      return {statuscode:201, message: 'Sucesso ao cadastrar.'}
    
    }catch{
      throw new BadRequestException("Erro ao criar publicação.")
    }
  }

  async listarPublicacoes(){
    try{
      const listaAcao:PublicacaoEntity[] = await this.publicacaoRepository.find({relations:{usuario:true}})

      return listaAcao.map(
        (publicacao)=> new ListaPublicacaoDTO(
          publicacao.id,
          publicacao.categoria,          
          publicacao.titulo, 
          publicacao.descricao, 
          publicacao.data,          
          publicacao.usuario.nome
        )
      );
    }catch{
      throw new BadRequestException("Erro ao buscar ações.")
    }
  }

  async buscarPublicacao(id:number){
      const publicacaoEncontrada: PublicacaoEntity = await this.publicacaoRepository.findOneBy({id:id});

      if(!publicacaoEncontrada)
        throw new NotFoundException('Nenhuma publicação encontrada.') 
    
      return publicacaoEncontrada;
  }

  async buscaAcaoPorTexto(text: string){
    const publicacao: PublicacaoEntity[] = await this.publicacaoRepository
      .createQueryBuilder('publicacao')
      .select(['publicacao.id', 'publicacao.titulo', 'publicacao.descricao'])
      .where('lower(publicacao.titulo) like concat("%", lower(:text), "%")', {text})
      .getMany()

    console.log(publicacao)
    return publicacao;
  }

  async editarPublicacao(idUsuario: number, idPublicacao:number, novosDadosPublicacao: AtualizaPublicacaoDTO){
    const usuario: UsuarioEntity = await this.usuarioService.buscarUsuario(idUsuario);
    let acaoEncontradaUsuario: PublicacaoEntity | null = null;

    try{
      const publicacaoEncontrada: PublicacaoEntity = await this.buscarPublicacao(idPublicacao);

      for(let publicacao of usuario.acoes){
        if(publicacao.id === publicacaoEncontrada.id)
          acaoEncontradaUsuario = publicacao
      }

      if(acaoEncontradaUsuario === null)  
        throw new NotFoundException('Nenhuma publicação encontrada.');

      await this.publicacaoRepository.update(publicacaoEncontrada, novosDadosPublicacao)

      return {statuscode:200, message: 'Alteração feita com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao editar publicação.')
    }
  }

  async deletarAcao(idUsuario:number, idPublicacao:number){
    const usuarioEncontrado: UsuarioEntity = await this.usuarioService.buscarUsuario(idUsuario);
    const publicacaoEncontrada: PublicacaoEntity = await this.buscarPublicacao(idPublicacao);

    if(!publicacaoEncontrada)
      throw new NotFoundException("Publicação não encontrada.")

    try{
      for(let publicacao of usuarioEncontrado.acoes){

        if(publicacao.id === idPublicacao)
          await this.publicacaoRepository.delete(publicacao)
      }

      return {statuscode:200, message:'Publicação excluída com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao excluir publicação.')
    }
  }
}
