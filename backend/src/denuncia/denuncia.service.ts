import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CriaDenunciaDTO } from './dto/criaDenuncia.dto';
import { ListaDenunciasDTO } from './dto/listaDenuncias.dto';
import { UsuarioEntity } from '../usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DenunciaEntity } from './entities/denuncia.entity';
import { UsuarioService } from '../usuario/usuario.service';
import { Between, Repository } from 'typeorm';
import { BuscaDenunciaDTO } from './dto/buscaDenuncia.dto';
import { PublicacaoEntity } from '../publicacao/entities/publicacao.entity';
import { PublicacaoService } from '../publicacao/publicacao.service';

@Injectable()
export class DenunciaService {
  constructor(
    @InjectRepository(DenunciaEntity) 
    private readonly denunciaRepository: Repository<DenunciaEntity>,
    private readonly usuarioService: UsuarioService,
    private readonly publicacaoService: PublicacaoService
  ){}
  
  async criar(denuncia: CriaDenunciaDTO) {
    try{
      const usuarioRemetente: UsuarioEntity = await this.usuarioService.buscar(denuncia.idUsuarioRemetente);
      const usuarioDenunciado: UsuarioEntity = await this.usuarioService.buscar(denuncia.idUsuarioDenunciado);
      const publicacao: PublicacaoEntity = await this.publicacaoService.buscar(denuncia.idPublicacao);
      const novaDenuncia: DenunciaEntity =  new DenunciaEntity();

      if(!usuarioRemetente || !usuarioDenunciado)
        throw new NotFoundException('Usuário reconhecer usuário.')

      novaDenuncia.descricao = denuncia.descricao;
      novaDenuncia.publicacao = publicacao;
      novaDenuncia.usuarioDenunciado = usuarioDenunciado;
      novaDenuncia.usuarioRemetente = usuarioRemetente;

      await this.denunciaRepository.save(denuncia);

      return {statusCode: 200, message:'Denúncia feita com sucesso.'};

    }catch(erro){

      if(erro instanceof NotFoundException)
        throw erro;

      throw new BadRequestException('Erro ao criar denúncia.')
    }
  }

  async listar() {
    try{
      const denuncias: DenunciaEntity[] = await this.denunciaRepository.find({relations:{usuarioDenunciado: true, usuarioRemetente: true}, order:{data: 'DESC'}})
      return denuncias.map( 
        (denuncia) => new ListaDenunciasDTO(
          denuncia.id, denuncia.descricao, denuncia.data, denuncia.publicacao.titulo, denuncia.usuarioDenunciado.nome, denuncia.usuarioRemetente.nome 
        ))
    }catch{
      throw new BadRequestException('Falha ao buscar denuncias.')
    }
  }

  async buscar(parametro: BuscaDenunciaDTO){
    try{
      const usuarioRemetente: UsuarioEntity = await this.usuarioService.buscar(parametro.idUsuarioRemetente);
      const usuarioDenunciado: UsuarioEntity = await this.usuarioService.buscar(parametro.idUsuarioDenunciado);
      const publicacao: PublicacaoEntity | null = await this.publicacaoService.buscar(parametro.idPublicacao);
      
      if (!usuarioRemetente || !usuarioDenunciado) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      const denuncias: DenunciaEntity[] = await this.denunciaRepository.find({
        where: [{id:parametro.id},{publicacao:publicacao},{usuarioDenunciado:usuarioDenunciado},{usuarioRemetente:usuarioRemetente},{data: Between(parametro.dataInicio, parametro.dataFim)}],
        relations: {usuarioDenunciado: true, usuarioRemetente: true},
        order: {usuarioDenunciado: 'DESC'}
      });
      
      return denuncias.map((denuncia) => new ListaDenunciasDTO(
          denuncia.id, denuncia.descricao, denuncia.data, denuncia.publicacao.titulo, denuncia.usuarioDenunciado.nome, denuncia.usuarioRemetente.nome 
        ))

    }catch(erro){

      if(erro instanceof NotFoundException)
        throw erro;

      throw new InternalServerErrorException('Falha ao buscar denuncia. Tente novamente');
    }
  }
}
