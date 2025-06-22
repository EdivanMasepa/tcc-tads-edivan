import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriaPublicacaoDTO } from './dto/criaPublicacao.dto';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import { PublicacaoEntity } from './entities/publicacao.entity';
import { AtualizaPublicacaoDTO } from './dto/atualizaPublicacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ListaPublicacaoDTO } from './dto/listaPublicacao.dto';
import { AvaliaPublicacaoDTO } from './dto/avaliaPublicacao.dto';

@Injectable()
export class PublicacaoService {
  constructor(
    @InjectRepository(PublicacaoEntity) private readonly publicacaoRepository: Repository<PublicacaoEntity>,
    private readonly usuarioService: UsuarioService){}

  async criar(idUsuario: number, publicacao:CriaPublicacaoDTO){
    try{
      const usuarioEncontrado:UsuarioEntity = await this.usuarioService.buscar(idUsuario);
      const publicacaoEntity:PublicacaoEntity = new PublicacaoEntity();
    
      publicacaoEntity.categoria = publicacao.categoria;
      publicacaoEntity.titulo = publicacao.titulo;
      publicacaoEntity.descricao = publicacao.descricao;
      publicacaoEntity.data = publicacao.data;
      publicacaoEntity.usuarioResponsavel = usuarioEncontrado
   
      await this.publicacaoRepository.save(publicacaoEntity)
      
      return {statuscode:201, message: 'Sucesso ao cadastrar.'}
    
    }catch{
      throw new BadRequestException("Erro ao criar publicação.")
    }
  }

  async listar(aprovada: boolean | null){
    try{
      const listaAcao:PublicacaoEntity[] = await this.publicacaoRepository.find({where:{aprovada:aprovada}, relations:{usuarioResponsavel:true}})

      return listaAcao.map(
        (publicacao)=> new ListaPublicacaoDTO(
          publicacao.id,
          publicacao.categoria,          
          publicacao.titulo, 
          publicacao.descricao, 
          publicacao.data,    
          publicacao.aprovada,      
          publicacao.usuarioResponsavel.nome
        )
      );
    }catch{
      throw new BadRequestException("Erro ao buscar ações.")
    }
  }

  async buscar(id:number){
      const publicacaoEncontrada: PublicacaoEntity = await this.publicacaoRepository.findOneBy({id:id});

      if(!publicacaoEncontrada)
        throw new NotFoundException('Nenhuma publicação encontrada.') 
    
      return publicacaoEncontrada;
  }

  async buscarPorTexto(text: string){
    const publicacao: PublicacaoEntity[] = await this.publicacaoRepository
      .createQueryBuilder('publicacao')
      .select(['publicacao.id', 'publicacao.titulo', 'publicacao.descricao'])
      .where('lower(publicacao.titulo) like concat("%", lower(:text), "%")', {text})
      .getMany()

    console.log(publicacao)
    return publicacao;
  }

  async editar(idUsuario: number, idPublicacao:number, novosDadosPublicacao: AtualizaPublicacaoDTO){
    const usuario: UsuarioEntity = await this.usuarioService.buscar(idUsuario);
    let publicacaoEncontradaUsuario: PublicacaoEntity | null = null;

    try{
      const publicacaoEncontrada: PublicacaoEntity = await this.buscar(idPublicacao);

      for(let publicacao of usuario.publicacoes){
        if(publicacao.id === publicacaoEncontrada.id)
          publicacaoEncontradaUsuario = publicacao
      }

      if(publicacaoEncontradaUsuario === null)  
        throw new NotFoundException('Nenhuma publicação encontrada.');

      await this.publicacaoRepository.update(publicacaoEncontrada, novosDadosPublicacao)

      return {statuscode:200, message: 'Alteração feita com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao editar publicação.')
    }
  }

  async avaliar(aprovada: AvaliaPublicacaoDTO, idUsuario: number){
    const publicacao: PublicacaoEntity = await this.buscar(aprovada.idPublicacao);

    if(!publicacao)
      throw new NotFoundException('Publicação não encontrada.')

    try{
      const usuario:UsuarioEntity = await this.usuarioService.buscar(idUsuario) 

      if(usuario.moderador === true){
        publicacao.aprovada = aprovada.aprovada;
        publicacao.usuarioModerador = usuario;
      }
      await this.publicacaoRepository.save(publicacao)

      return {statuscode:200, message: 'Alteração feita com sucesso.'}

    }catch(erro){
      throw new BadRequestException('Erro ao atualizar publicacao.')
    }
  }

  async deletar(idUsuario:number, idPublicacao:number){
    const usuarioEncontrado: UsuarioEntity = await this.usuarioService.buscar(idUsuario);
    const publicacaoEncontrada: PublicacaoEntity = await this.buscar(idPublicacao);

    if(!publicacaoEncontrada)
      throw new NotFoundException("Publicação não encontrada.")

    try{
      for(let publicacao of usuarioEncontrado.publicacoes){

        if(publicacao.id === idPublicacao)
          await this.publicacaoRepository.delete(publicacao)
      }

      return {statuscode:200, message:'Publicação excluída com sucesso.'}

    }catch{
      throw new BadRequestException('Erro ao excluir publicação.')
    }
  }
}
